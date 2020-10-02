module.exports = (sequelize, DataTypes) => {
    const Buy = sequelize.define('Buy', {
        productid: DataTypes.STRING,
        userid: DataTypes.STRING,
        email: DataTypes.STRING,
        qty: DataTypes.STRING,
        prices: DataTypes.STRING,
        pictures: DataTypes.STRING,
        trackingnumber: DataTypes.STRING,
        clientStatus: DataTypes.STRING,
        shopStatus: DataTypes.STRING,
        producttitle: DataTypes.STRING,
        username: DataTypes.STRING,
        userlastname: DataTypes.STRING,
    })
    return Buy
}