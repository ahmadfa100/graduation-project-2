CREATE TABLE users (
    ID SERIAL PRIMARY KEY,
    FirstName VARCHAR(50) NOT NULL,
    LastName VARCHAR(50) NOT NULL,
	password VARCHAR(256) NOT NULL,
    phoneNumber VARCHAR(15) UNIQUE NOT NULL,
    Email VARCHAR(150) UNIQUE NOT NULL,
    age INT,
    address VARCHAR(255),
    pfp BYTEA,
 gender VARCHAR(6) CHECK (gender IN ('male', 'female'))

);
CREATE TABLE Landowners (
    ID INT PRIMARY KEY REFERENCES users(ID) ON DELETE CASCADE    
);

CREATE TABLE Farmers (
    ID INT PRIMARY KEY REFERENCES users(ID) ON DELETE CASCADE
);

CREATE TABLE Offers (
    ID SERIAL PRIMARY KEY,
    landTitle varchar(255),
    landSize NUMERIC(10, 2) NOT NULL,
    landLocation VARCHAR(255) NOT NULL,
    PhoneNumber VARCHAR(20),
    --locMap text,
    offerDescription TEXT,
    landLeasePrice NUMERIC(10, 2) NOT NULL,-- in jordan its impossible but may be in other countries--
    leaseDuration int ,-- leaseDuration in mounths
    offerDate Date NOT NULL DEFAULT CURRENT_DATE, 
    OwnerID INT NOT NULL   REFERENCES Landowners(ID) ON DELETE CASCADE
   
);

CREATE TABLE  landPicture(
ID SERIAL PRIMARY KEY,
	landID int not null REFERENCES offers(id) on delete cascade,
	picture bytea
);

CREATE TABLE FavoriteOffers (
    --FavoriteOffers--
    farmerID INT NOT NULL,
    offerID INT NOT NULL,
    CONSTRAINT PK_FavoriteOffers PRIMARY KEY (farmerID, offerID),
    CONSTRAINT FK_FavoriteOffers_Farmer FOREIGN KEY (farmerID) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT FK_FavoriteOffers_Offer FOREIGN KEY (offerID) REFERENCES offers(id) ON DELETE CASCADE
);

CREATE TABLE EducationalResource (
	--EducationalResource--
	-- in docs its linked with user but i see its unuseful?!--
    resourceID SERIAL PRIMARY KEY,
    url text NOT NULL,
    type varchar(50) not null
);
CREATE TABLE Notifications (
    ID SERIAL PRIMARY KEY,
   NText TEXT NOT NULL,
    NDate TIMESTAMP NOT NULL DEFAULT CURRENT_DATE,
    userID INT NOT NULL  REFERENCES users(ID) ON DELETE CASCADE,
     type VARCHAR(50)
   
);
CREATE TABLE Chats (
    ID SERIAL PRIMARY key,
    senderID INT NOT NULL REFERENCES users(ID) ON DELETE CASCADE,
    receiverID INT NOT NULL REFERENCES users(ID) ON DELETE CASCADE,
    offerID INT NOT NULL REFERENCES offers(ID) ON DELETE CASCADE,
    chatDate TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    CONSTRAINT check_sender_receiver CHECK (senderID <> receiverID)
    CONSTRAINT check_sender_receiver CHECK (senderID <> receiverID)
    CONSTRAINT  unique_chat_per_offer UNIQUE (senderID, receiverID, offerID)


    
  
);
CREATE TABLE ChatContents (
    contentID SERIAL PRIMARY KEY,
    chatID INT REFERENCES Chats(ID) ON DELETE CASCADE,
    senderID INT NOT NULL REFERENCES users(ID) ON DELETE CASCADE,
    contentText varchar(255) ,  
    contentFile BYTEA ,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP  
    
);
/*
DROP TABLE IF EXISTS ChatContents;
DROP TABLE IF EXISTS Chats;
DROP TABLE IF EXISTS Notifications;
DROP TABLE IF EXISTS ER;
DROP TABLE IF EXISTS fo;
DROP TABLE IF EXISTS landPicture;
DROP TABLE IF EXISTS Offers;
DROP TABLE IF EXISTS Farmers;
DROP TABLE IF EXISTS Landowners;
DROP TABLE IF EXISTS users;
TRUNCATE TABLE your_table_name RESTART IDENTITY CASCADE; reset table


*/
-- you can use BYTEA for image if ur team refuse cloud --
-- for higher level of security and u wanna use hashing then password wwill be varchar(60) for 10 salt round also email could be hashing