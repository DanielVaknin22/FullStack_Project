const Student = require("../models/student_model");

const getStudents = async (req, res) => {
    console.log("student get");
    try {
      let student;
      if (req.query.name) {
        student = await Student.find({ name: req.query.name });
      } else {
        student = await Student.find();
      }
      res.status(200).send(student);
    } catch (error) {
      console.log(error);
      res.status(400).send(error.message);
    }
  };

const getStudentsById = async (req, res) => {
    console.log(req.params);
    try {
      const student = await Student.findById(req.params.id);
      if (!student) {
        return res.status(404).send("Student not found");
      } else {
        return res.status(200).send(student);
      }
    } catch (error) {
      console.log(error);
      res.status(400).send(error.message);
    }
  };

const postStudents = async (req, res) => {
    console.log("student post");
    try {
      const student = await Student.create(req.body);
      res.status(201).send(student);
    } catch (error) {
      console.log(error);
      res.status(400).send(error.message);
    }
};

const putStudents = (req, res) => {
  res.send("student put");
};

const deleteStudents = async (req, res) => {
  res.send("student delete");
  try {
    await Student.findByIdAndDelete(req.params.id);
    return res.status(200).send();
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message);
  }
};

module.exports = { 
    getStudents,
    getStudentsById, 
    postStudents, 
    putStudents, 
    deleteStudents,
};
