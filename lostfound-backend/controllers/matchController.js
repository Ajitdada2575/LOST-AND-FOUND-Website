const pool = require("../config/db");

const normalize = value => {
  if (!value) return "";
  return value.toString().trim().toLowerCase();
};

const textSimilarity = (a, b) => {
  a = normalize(a);
  b = normalize(b);

  if (!a || !b) return 0;

  if (a === b) return 1;

  if (a.includes(b) || b.includes(a)) return 0.7;

  const wordsA = new Set(a.split(/\s+/));
  const wordsB = new Set(b.split(/\s+/));

  const intersection = [...wordsA].filter(word => wordsB.has(word));

  if (intersection.length === 0) return 0;

  return intersection.length / Math.max(wordsA.size, wordsB.size);
};

const dateSimilarity = (date1, date2) => {
  if (!date1 || !date2) return 0;

  const d1 = new Date(date1);
  const d2 = new Date(date2);

  const diff = Math.abs(d1 - d2) / (1000 * 60 * 60 * 24);

  if (diff === 0) return 1;
  if (diff <= 1) return 0.8;
  if (diff <= 3) return 0.5;
  if (diff <= 7) return 0.2;

  return 0;
};

const timeSimilarity = (time1, time2) => {
  if (!time1 || !time2) return 0;

  const [h1, m1] = time1.toString().split(":").map(Number);
  const [h2, m2] = time2.toString().split(":").map(Number);

  const minutes1 = h1 * 60 + m1;
  const minutes2 = h2 * 60 + m2;

  const diff = Math.abs(minutes1 - minutes2);

  if (diff <= 30) return 1;
  if (diff <= 60) return 0.8;
  if (diff <= 180) return 0.5;
  if (diff <= 360) return 0.2;

  return 0;
};

const calculateMatch = (lost, found) => {
  const categoryScore =
    lost.category_id === found.category_id ? 1 : 0;

  const colorScore = textSimilarity(
    lost.color,
    found.color
  );

  const brandScore = textSimilarity(
    lost.brand,
    found.brand
  );

  const locationScore =
    lost.location_id === found.location_id ? 1 : 0;

  const dateScore = dateSimilarity(
    lost.lost_date,
    found.found_date
  );

  const timeScore = timeSimilarity(
    lost.approximate_time,
    found.approximate_time
  );

  const datetimeScore =
    (dateScore + timeScore) / 2;

  const specificScore = textSimilarity(
    [
      lost.model,
      lost.material,
      lost.item_type,
      lost.storage_capacity,
      lost.case_color,
      lost.cash_amount,
      lost.number_of_cards,
      lost.id_present,
      lost.number_of_compartments,
      lost.contents,
      lost.distinguishing_features
    ].filter(Boolean).join(" "),
    [
      found.model,
      found.material,
      found.item_type,
      found.storage_capacity,
      found.case_color,
      found.cash_amount,
      found.number_of_cards,
      found.id_present,
      found.number_of_compartments,
      found.contents,
      found.distinguishing_features
    ].filter(Boolean).join(" ")
  );

  const descriptionScore = textSimilarity(
    lost.description,
    found.description
  );

  const matchScore =
    categoryScore * 25 +
    colorScore * 15 +
    brandScore * 15 +
    locationScore * 15 +
    datetimeScore * 10 +
    specificScore * 10 +
    descriptionScore * 10;

  let classification;

  if (matchScore >= 80) {
    classification = "VERY_STRONG_POTENTIAL_MATCH";
  } else if (matchScore >= 60) {
    classification = "STRONG_POTENTIAL_MATCH";
  } else if (matchScore >= 30) {
    classification = "POSSIBLE_MATCH";
  } else {
    classification = "NO_MEANINGFUL_MATCH";
  }

  return {
    matchScore: Number(matchScore.toFixed(2)),
    classification,
    categoryScore: Number((categoryScore * 25).toFixed(2)),
    colorScore: Number((colorScore * 15).toFixed(2)),
    brandScore: Number((brandScore * 15).toFixed(2)),
    locationScore: Number((locationScore * 15).toFixed(2)),
    datetimeScore: Number((datetimeScore * 10).toFixed(2)),
    specificScore: Number((specificScore * 10).toFixed(2)),
    descriptionScore: Number((descriptionScore * 10).toFixed(2))
  };
};


const generateMatchesForLostItem = async (req, res) => {
  try {
    const { lostId } = req.params;

    // Get lost item
    const [lostRows] = await pool.query(
      `SELECT
        li.lost_item_id,
        li.category_id,
        li.location_id,
        li.title,
        li.description,
        li.lost_date,
        li.approximate_time,

        d.brand,
        d.model,
        d.color,
        d.material,
        d.item_type,
        d.storage_capacity,
        d.case_color,
        d.cash_amount,
        d.number_of_cards,
        d.id_present,
        d.number_of_compartments,
        d.contents,
        d.distinguishing_features

      FROM lost_items li
      LEFT JOIN item_details d
        ON li.lost_item_id = d.lost_item_id

      WHERE li.lost_item_id = ?`,
      [lostId]
    );

    if (lostRows.length === 0) {
      return res.status(404).json({
        message: "Lost item not found"
      });
    }

    const lost = lostRows[0];

    // Get active found items
    const [foundRows] = await pool.query(
      `SELECT
        f.found_item_id,
        f.category_id,
        f.location_id,
        f.title,
        f.description,
        f.found_date,
        f.approximate_time,

        d.brand,
        d.model,
        d.color,
        d.material,
        d.item_type,
        d.storage_capacity,
        d.case_color,
        d.cash_amount,
        d.number_of_cards,
        d.id_present,
        d.number_of_compartments,
        d.contents,
        d.distinguishing_features

      FROM found_items f
      LEFT JOIN item_details d
        ON f.found_item_id = d.found_item_id

      WHERE f.status = 'ACTIVE'`
    );

    const matches = [];

    for (const found of foundRows) {
      const result = calculateMatch(lost, found);

      // Save only meaningful matches
      if (result.matchScore >= 30) {
        const [existing] = await pool.query(
          `SELECT match_id
           FROM matches
           WHERE lost_item_id = ?
           AND found_item_id = ?`,
          [lostId, found.found_item_id]
        );

        if (existing.length > 0) {
          await pool.query(
            `UPDATE matches
             SET
               match_score = ?,
               match_classification = ?,
               category_score = ?,
               color_score = ?,
               brand_score = ?,
               location_score = ?,
               datetime_score = ?,
               specific_attribute_score = ?,
               description_score = ?
             WHERE match_id = ?`,
            [
              result.matchScore,
              result.classification,
              result.categoryScore,
              result.colorScore,
              result.brandScore,
              result.locationScore,
              result.datetimeScore,
              result.specificScore,
              result.descriptionScore,
              existing[0].match_id
            ]
          );
        } else {
          await pool.query(
            `INSERT INTO matches (
              lost_item_id,
              found_item_id,
              match_score,
              match_classification,
              category_score,
              color_score,
              brand_score,
              location_score,
              datetime_score,
              specific_attribute_score,
              description_score
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              lostId,
              found.found_item_id,
              result.matchScore,
              result.classification,
              result.categoryScore,
              result.colorScore,
              result.brandScore,
              result.locationScore,
              result.datetimeScore,
              result.specificScore,
              result.descriptionScore
            ]
          );
        }

        matches.push({
          found_item_id: found.found_item_id,
          title: found.title,
          match_score: result.matchScore,
          match_classification: result.classification,
          category_score: result.categoryScore,
          color_score: result.colorScore,
          brand_score: result.brandScore,
          location_score: result.locationScore,
          datetime_score: result.datetimeScore,
          specific_attribute_score: result.specificScore,
          description_score: result.descriptionScore
        });
      }
    }

    matches.sort((a, b) => b.match_score - a.match_score);

    res.json({
      lost_item_id: Number(lostId),
      total_matches: matches.length,
      matches
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to generate matches"
    });
  }
};


const getMatchesForLostItem = async (req, res) => {
  try {
    const { lostId } = req.params;

    const [rows] = await pool.query(
      `SELECT
        m.match_id,
        m.lost_item_id,
        m.found_item_id,
        m.match_score,
        m.match_classification,
        m.category_score,
        m.color_score,
        m.brand_score,
        m.location_score,
        m.datetime_score,
        m.specific_attribute_score,
        m.description_score,
        m.created_at,

        f.title,
        f.description,
        f.found_date,
        f.approximate_time,
        f.status

      FROM matches m

      JOIN found_items f
        ON m.found_item_id = f.found_item_id

      WHERE m.lost_item_id = ?

      ORDER BY m.match_score DESC`,
      [lostId]
    );

    res.json(rows);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch matches"
    });
  }
};


module.exports = {
  generateMatchesForLostItem,
  getMatchesForLostItem
};