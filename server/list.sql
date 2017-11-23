CREATE TABLE list
(
    name VARCHAR(255),
    id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    CONSTRAINT list_user_id_fk FOREIGN KEY (user_id) REFERENCES user (id)
);