const pool = require("../config/db");
const { createNotification } = require("./notificationController");

const createClaim = async (req, res) => {
  try {
    const { match_id } = req.body;
    const userId = req.user.userId;

    if (!match_id) {
      return res.status(400).json({
        message: "Match ID is required"
      });
    }

    // Check whether match exists
    const [matches] = await pool.query(
      `SELECT match_id, lost_item_id, found_item_id
       FROM matches
       WHERE match_id = ?`,
      [match_id]
    );

    if (matches.length === 0) {
      return res.status(404).json({
        message: "Match not found"
      });
    }

    // Prevent duplicate claim by same user
    const [existingClaims] = await pool.query(
      `SELECT claim_id, status
       FROM claim_requests
       WHERE match_id = ?
       AND claimant_user_id = ?
       AND status IN ('PENDING', 'APPROVED')`,
      [match_id, userId]
    );

    if (existingClaims.length > 0) {
      return res.status(409).json({
        message: "You already have an active claim for this match"
      });
    }

    // Create claim
    const [result] = await pool.query(
      `INSERT INTO claim_requests (
        match_id,
        claimant_user_id,
        status
      )
      VALUES (?, ?, 'PENDING')`,
      [match_id, userId]
    );

    // Create notification for claimant
    await createNotification(
      userId,
      "CLAIM_SUBMITTED",
      "Claim Submitted",
      "Your claim has been submitted successfully and is awaiting review."
    );

    res.status(201).json({
      message: "Claim request submitted successfully",
      claimId: result.insertId,
      matchId: match_id
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to submit claim request"
    });
  }
};


const getMyClaims = async (req, res) => {
  try {
    const userId = req.user.userId;

    const [rows] = await pool.query(
      `SELECT
        cr.claim_id,
        cr.match_id,
        cr.status,
        cr.submitted_at,
        cr.reviewed_at,
        cr.reviewer_user_id,
        cr.reviewer_comments,
        m.lost_item_id,
        m.found_item_id,
        m.match_score,
        m.match_classification
      FROM claim_requests cr
      JOIN matches m ON cr.match_id = m.match_id
      WHERE cr.claimant_user_id = ?
      ORDER BY cr.submitted_at DESC`,
      [userId]
    );

    res.json(rows);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch claims"
    });
  }
};


const getAllClaims = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT
        cr.claim_id,
        cr.match_id,
        cr.claimant_user_id,
        u.name AS claimant_name,
        u.email AS claimant_email,
        cr.status,
        cr.submitted_at,
        cr.reviewed_at,
        cr.reviewer_user_id,
        cr.reviewer_comments,
        m.lost_item_id,
        m.found_item_id,
        m.match_score,
        m.match_classification
      FROM claim_requests cr
      JOIN users u ON cr.claimant_user_id = u.user_id
      JOIN matches m ON cr.match_id = m.match_id
      ORDER BY cr.submitted_at DESC`
    );

    res.json(rows);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch claims"
    });
  }
};

const reviewClaim = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, reviewer_comments } = req.body;
    const reviewerId = req.user.userId;

    if (!status) {
      return res.status(400).json({
        message: "Status is required"
      });
    }

    if (!["APPROVED", "REJECTED"].includes(status)) {
      return res.status(400).json({
        message: "Status must be APPROVED or REJECTED"
      });
    }

    const [claims] = await pool.query(
      `SELECT
        claim_id,
        claimant_user_id,
        status
       FROM claim_requests
       WHERE claim_id = ?`,
      [id]
    );

    if (claims.length === 0) {
      return res.status(404).json({
        message: "Claim not found"
      });
    }

    if (claims[0].status !== "PENDING") {
      return res.status(400).json({
        message: "Only pending claims can be reviewed"
      });
    }

    await pool.query(
      `UPDATE claim_requests
       SET
         status = ?,
         reviewed_at = CURRENT_TIMESTAMP,
         reviewer_user_id = ?,
         reviewer_comments = ?
       WHERE claim_id = ?`,
      [
        status,
        reviewerId,
        reviewer_comments || null,
        id
      ]
    );

    // Notify claimant only when claim is approved
    if (status === "APPROVED") {
      await createNotification(
        claims[0].claimant_user_id,
        "CLAIM_APPROVED",
        "Claim Approved",
        "Your claim has been approved. Please proceed with the item return process."
      );
    }

    res.json({
      message: `Claim ${status.toLowerCase()} successfully`,
      claimId: id,
      status
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to review claim"
    });
  }
};


module.exports = {
  createClaim,
  getMyClaims,
  getAllClaims,
  reviewClaim
};