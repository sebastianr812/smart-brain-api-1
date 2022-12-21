BEGIN TRANSACTION;

INSERT INTO users (name,email,entries,joined,age,pet) VALUES ('jessie', 'jessie@gmail.com', 5, '2018-01-01', 21, 'cat');
INSERT INTO login (hash,email) VALUES ('$2a$10$ZIIIpLnhuoecWcU27skpDOh8XnDbVk2vtJaI2VJyaQdx0DbGR5Wp6', 'jessie@gmail.com');

COMMIT;