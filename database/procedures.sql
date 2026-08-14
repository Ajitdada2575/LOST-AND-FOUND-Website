USE lost_found_db;

DELIMITER $$

CREATE PROCEDURE get_lost_item_by_id(IN p_lost_item_id INT)
BEGIN
    SELECT
        li.lost_item_id,
        li.title,
        li.description,
        li.image_url,
        li.lost_date,
        li.approximate_time,
        li.status,
        c.category_name,
        l.location_name,
        u.user_id,
        u.name AS reported_by
    FROM lost_items li
    JOIN categories c
        ON li.category_id = c.category_id
    JOIN locations l
        ON li.location_id = l.location_id
    JOIN users u
        ON li.user_id = u.user_id
    WHERE li.lost_item_id = p_lost_item_id;
END$$

DELIMITER ;
DELIMITER $$

CREATE PROCEDURE get_found_item_by_id(IN p_found_item_id INT)
BEGIN
    SELECT
        fi.found_item_id,
        fi.title,
        fi.description,
        fi.image_url,
        fi.found_date,
        fi.approximate_time,
        fi.status,
        c.category_name,
        l.location_name,
        u.user_id,
        u.name AS reported_by
    FROM found_items fi
    JOIN categories c
        ON fi.category_id = c.category_id
    JOIN locations l
        ON fi.location_id = l.location_id
    JOIN users u
        ON fi.user_id = u.user_id
    WHERE fi.found_item_id = p_found_item_id;
END$$

DELIMITER ;

DELIMITER $$

CREATE PROCEDURE get_matches_for_lost_item(IN p_lost_item_id INT)
BEGIN
    SELECT
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
        m.created_at
    FROM matches m
    WHERE m.lost_item_id = p_lost_item_id
    ORDER BY m.match_score DESC;
END$$

DELIMITER ;


DELIMITER $$

CREATE PROCEDURE get_matches_for_found_item(IN p_found_item_id INT)
BEGIN
    SELECT
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
        m.created_at
    FROM matches m
    WHERE m.found_item_id = p_found_item_id
    ORDER BY m.match_score DESC;
END$$

DELIMITER ;





DELIMITER $$

CREATE PROCEDURE create_match(
    IN p_lost_item_id INT,
    IN p_found_item_id INT,
    IN p_match_score DECIMAL(5,2),
    IN p_match_classification VARCHAR(50),
    IN p_category_score DECIMAL(5,2),
    IN p_color_score DECIMAL(5,2),
    IN p_brand_score DECIMAL(5,2),
    IN p_location_score DECIMAL(5,2),
    IN p_datetime_score DECIMAL(5,2),
    IN p_specific_attribute_score DECIMAL(5,2),
    IN p_description_score DECIMAL(5,2)
)
BEGIN
    INSERT INTO matches (
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
    VALUES (
        p_lost_item_id,
        p_found_item_id,
        p_match_score,
        p_match_classification,
        p_category_score,
        p_color_score,
        p_brand_score,
        p_location_score,
        p_datetime_score,
        p_specific_attribute_score,
        p_description_score
    );
END$$

DELIMITER ;





DELIMITER $$

CREATE PROCEDURE create_claim_request(
    IN p_match_id INT,
    IN p_claimant_user_id INT
)
BEGIN
    INSERT INTO claim_requests (
        match_id,
        claimant_user_id,
        status
    )
    VALUES (
        p_match_id,
        p_claimant_user_id,
        'PENDING'
    );
END$$

DELIMITER ;


















DELIMITER $$

CREATE PROCEDURE update_claim_status(
    IN p_claim_id INT,
    IN p_status VARCHAR(20),
    IN p_reviewer_user_id INT,
    IN p_reviewer_comments TEXT
)
BEGIN
    UPDATE claim_requests
    SET
        status = p_status,
        reviewer_user_id = p_reviewer_user_id,
        reviewer_comments = p_reviewer_comments,
        reviewed_at = CURRENT_TIMESTAMP
    WHERE claim_id = p_claim_id;
END$$

DELIMITER ;























DELIMITER $$

CREATE PROCEDURE mark_item_returned(
    IN p_match_id INT
)
BEGIN
    UPDATE lost_items li
    JOIN matches m
        ON m.lost_item_id = li.lost_item_id
    SET li.status = 'RETURNED'
    WHERE m.match_id = p_match_id;

    UPDATE found_items fi
    JOIN matches m
        ON m.found_item_id = fi.found_item_id
    SET fi.status = 'RETURNED'
    WHERE m.match_id = p_match_id;

    UPDATE claim_requests
    SET status = 'COMPLETED',
        reviewed_at = CURRENT_TIMESTAMP
    WHERE match_id = p_match_id
      AND status = 'APPROVED';
END$$

DELIMITER ;