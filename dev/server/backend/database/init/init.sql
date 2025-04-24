CREATE TABLE applicant (
  user_id UUID PRIMARY KEY,
  last_name VARCHAR(50) NOT NULL,
  first_name VARCHAR(50) NOT NULL,
  mail_address TEXT,
  phone_number VARCHAR(50),
  address TEXT,
  birth_date TIMESTAMP,
  license TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



INSERT INTO applicant (
    user_id, last_name, first_name, mail_address, phone_number, address, birth_date, license, updated_at 
) VALUES (
    'A1', '石田', '省吾', 'ishida@gmail.com', '012000000000', '大阪', '2000-03-21', '漢検5級', CURRENT_TIMESTAMP
);