const ResultModel = require("../models/ResultModel.js");

//Passed - this needs to be calculated in the backend as follows - if SAT score > 30% = Pass else Fail
const InsertResult = async function (req, res) {
    try {
        let body = req.body;
        let dataInBody = Object.keys(body);
        let arr = ["name", "address", "city", "country", "pincode", "score"];

        for (let i = 0; i < dataInBody.length; i++) {
            let someThing = dataInBody[i];
            if (!arr.includes(someThing)) {
                return res.status(400).send({ status: false, message: `${someThing} is not a valid Property.` });
            }
        }

        const { name, address, city, country, pincode, score } = body;
        if (Object.keys(body).length == 0) {
            return res.status(400).send({ status: false, message: "Request body can't be empty." });
        }

        if (name && typeof name != "string") {
            return res.status(400).send({ status: false, message: "Name must be in string" });
        }
        if (!name || !name.trim()) {
            return res.status(400).send({ status: false, message: "Name is required." });
        }
        const existName = await ResultModel.findOne({ name: name });
        if (existName) {
            return res.status(400).send({ status: false, message: "This name is already in use, try with another one." });
        }

        if (address && typeof address != "string") {
            return res.status(400).send({ status: false, message: "address must be in string" });
        }
        if (!address || !address.trim()) {
            return res.status(400).send({ status: false, message: "address is required." });
        }

        if (city && typeof city != "string") {
            return res.status(400).send({ status: false, message: "city must be in string" });
        }
        if (!city || !city.trim()) {
            return res.status(400).send({ status: false, message: "city is required." });
        }

        if (country && typeof country != "string") {
            return res.status(400).send({ status: false, message: "country must be in string" });
        }
        if (!country || !country.trim()) {
            return res.status(400).send({ status: false, message: "country is required." });
        }

        if (pincode && typeof pincode != "string") {
            return res.status(400).send({ status: false, message: "pincode must be in string" });
        }
        if (!pincode || !pincode.trim()) {
            return res.status(400).send({ status: false, message: "pincode is required." });
        }

        if (!score) {
            return res.status(400).send({ status: false, message: "score is mandatory." });
        }
        let Score = Number(score);
        if (isNaN(Score)) {
            return res.status(400).send({ status: false, message: "Invalid score entry, score should be a number." });
        }
        if (Score < 0) {
            return res.status(400).send({ status: false, message: "score must be positive Integer." });
        }

        const passed = Score > 30 ? "Pass" : "Fail";
        body.passed = passed;

        const InsertData = await ResultModel.create(body);

        return res.status(201).send({ status: true, message: "Data Inserted successfully", data: InsertData });
    } catch (err) {
        return res.status(500).send({ status: false, message: err.message });
    }
}

//View all data - this should display all the data from the memory in Json format
const getAllData = async function (req, res) {
    try {
        const ViewAllData = await ResultModel.find({ isDeleted: false });
        return res.status(200).send({ status: true, message: "All Data fetch successfully", data: ViewAllData });
    } catch (err) {
        return res.status(500).send({ status: false, message: err.message });
    }
}

//Get rank - this takes the name and returns their rank according to the data from the memory
const getRank = async function (req, res) {
    try {
        const { name } = req.params;

        const result = await ResultModel.findOne({ name: name, isDeleted: false });
        if (!result) {
            res.status(404).send({ status: false, message: "Record not found" });
        }

        const Count = await ResultModel.find({ score: { $gt: result.score }, isDeleted: false }).count();
        const rank = Count + 1;

        return res.status(200).send({ status: true, message: `Rank for ${name} is: ${rank}` });
    } catch (err) {
        return res.status(500).send({ status: false, message: err.message });
    }
}

//Update score - this allows to update SAT score for a candidate by name
const updateScore = async function (req, res) {
    try {
        const { name } = req.params;
        const { score } = req.body;

        if (!score) {
            return res.status(400).send({ status: false, message: "score is mandatory." });
        }
        let Score = Number(score);
        if (isNaN(Score)) {
            return res.status(400).send({ status: false, message: "Invalid score entry, score should be a number." });
        }
        if (Score < 0) {
            return res.status(400).send({ status: false, message: "score must be positive Integer." });
        }

        let obj = {
            score: Score
        };

        obj.passed = (Score > 30) ? "Pass" : "Fail";

        const result = await ResultModel.findOneAndUpdate(
            { name: name, isDeleted: false },
            obj,
            { new: true }
        );

        if (!result) {
            res.status(404).send({ status: false, message: "Record not found" });
        }

        return res.status(200).send({ status: true, message: "Score Updated Successfully", data: result });
    } catch (err) {
        return res.status(500).send({ status: false, message: err.message });
    }
}


//Delete one record - this deletes a record by name
const deleteRecord = async function (req, res) {
    try {
        const { name } = req.params;

        const result = await ResultModel.findOneAndUpdate(
            { name: name, isDeleted: false },
            { $set: { isDeleted: true } }
        );

        if (!result) {
           return res.status(404).send({ status: false, message: "Record not found" });
        }

        return res.status(200).send({ status: true, message: "Record deleted Successfully" });
    } catch (err) {
        return res.status(500).send({ status: false, message: err.message });
    }
}

module.exports = { InsertResult, getAllData, getRank, updateScore, deleteRecord };