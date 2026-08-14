USE lost_found_db;

DELIMITER $$

CREATE TRIGGER notify_found_item_match
AFTER INSERT ON matches
FOR EACH ROW
BEGIN
    INSERT INTO notifications (
        user_id,
        notification_type,
        title,
        message
    )
    SELECT
        li.user_id,
        'POTENTIAL_MATCH',
        'Potential Match Found',
        CONCAT(
            'A potential match was found for your lost item. Match score: ',
            NEW.match_score,
            '%'
        )
    FROM lost_items li
    WHERE li.lost_item_id = NEW.lost_item_id
      AND NEW.match_score >= 80;
END$$

DELIMITER ;




DELIMITER $$

CREATE TRIGGER update_item_status_on_claim
AFTER UPDATE ON claim_requests
FOR EACH ROW
BEGIN
    IF NEW.status = 'APPROVED' AND OLD.status <> 'APPROVED' THEN

        UPDATE lost_items li
        JOIN matches m
            ON m.lost_item_id = li.lost_item_id
        SET li.status = 'CLAIM_APPROVED'
        WHERE m.match_id = NEW.match_id;

        UPDATE found_items fi
        JOIN matches m
            ON m.found_item_id = fi.found_item_id
        SET fi.status = 'CLAIM_APPROVED'
        WHERE m.match_id = NEW.match_id;

    END IF;
END$$

DELIMITER ;




DELIMITER $$

CREATE TRIGGER log_found_item_deletion
AFTER DELETE ON found_items
FOR EACH ROW
BEGIN
    INSERT INTO notifications (
        user_id,
        notification_type,
        title,
        message
    )
    VALUES (
        OLD.user_id,
        'SYSTEM',
        'Found Item Report Deleted',
        CONCAT(
            'Your found item report #',
            OLD.found_item_id,
            ' has been deleted.'
        )
    );
END$$

DELIMITER ;



DELIMITER $$

CREATE TRIGGER log_lost_item_deletion
AFTER DELETE ON lost_items
FOR EACH ROW
BEGIN
    INSERT INTO notifications (
        user_id,
        notification_type,
        title,
        message
    )
    VALUES (
        OLD.user_id,
        'SYSTEM',
        'Lost Item Report Deleted',
        CONCAT(
            'Your lost item report #',
            OLD.lost_item_id,
            ' has been deleted.'
        )
    );
END$$

DELIMITER ;



DELIMITER $$

CREATE TRIGGER notify_new_claim
AFTER INSERT ON claim_requests
FOR EACH ROW
BEGIN
    INSERT INTO notifications (
        user_id,
        notification_type,
        title,
        message
    )
    SELECT
        fi.user_id,
        'CLAIM_SUBMITTED',
        'New Claim Request',
        CONCAT(
            'A claim request has been submitted for your found item. Claim ID: ',
            NEW.claim_id
        )
    FROM matches m
    JOIN found_items fi
        ON fi.found_item_id = m.found_item_id
    WHERE m.match_id = NEW.match_id;
END$$

DELIMITER ;


DELIMITER $$

CREATE TRIGGER check_old_items
BEFORE INSERT ON lost_items
FOR EACH ROW
BEGIN
    IF NEW.lost_date < DATE_SUB(CURDATE(), INTERVAL 30 DAY) THEN
        SET NEW.status = 'CLOSED';
    END IF;
END$$

DELIMITER ;