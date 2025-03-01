CREATE TABLE users (
    ID SERIAL PRIMARY KEY,
    userName VARCHAR(50) NOT NULL,
	password VARCHAR(255) NOT NULL,
    phoneNumber VARCHAR(15) UNIQUE NOT NULL,
    Email VARCHAR(150) UNIQUE NOT NULL,
    age INT,
    address VARCHAR(255),
    pfp text
);
CREATE TABLE Landowners (
    ID INT PRIMARY KEY REFERENCES users(ID) ON DELETE CASCADE    
);

CREATE TABLE Farmers (
    ID INT PRIMARY KEY REFERENCES users(ID) ON DELETE CASCADE
);

CREATE TABLE Offers (
    ID SERIAL PRIMARY KEY,
    landSize DECIMAL(10, 2) NOT NULL,
    landLocation VARCHAR(255) NOT NULL,
    --locMap text,
    offerDescription TEXT,
    landLeasePrice DECIMAL(10, 2) NOT NULL,-- in jordan its impossible but may be in other countries--
    landLeaseType VARCHAR(50) NOT NULL,
    landPicture TEXT, 
    offerDate Date NOT NULL DEFAULT CURRENT_DATE, 
    OwnerID INT NOT NULL   REFERENCES Landowners(ID) ON DELETE CASCADE
   
);

CREATE TABLE  landPicture(
ID SERIAL PRIMARY KEY,
	landID int not null REFERENCES offers(id) on delete cascade,
	url TEXT 
);

CREATE TABLE FavoriteOffers (
	--FavoriteOffers--
    farmerID INT not null REFERENCES farmers(id) on delete cascade ,
    offerID INT not null references offers(id) on delete cascade,
    PRIMARY KEY (farmerID, offerID)
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
    userID INT NOT NULL  REFERENCES users(ID) ON DELETE CASCADE
   
);
CREATE TABLE Chats (
    ID SERIAL PRIMARY key,
    senderID INT NOT NULL REFERENCES users(ID) ON DELETE CASCADE,
    receiverID INT NOT NULL REFERENCES users(ID) ON DELETE CASCADE,
    chatDate TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    
  
);
CREATE TABLE ChatContents (
    contentID SERIAL PRIMARY KEY,
    chatID INT REFERENCES Chats(ID) ON DELETE CASCADE,
    contentText TEXT,  
    contentURL TEXT   
    
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

*/
-- you can use BYTEA for image if ur team refuse cloud --