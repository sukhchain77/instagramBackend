const { Router } = require("express");
const User = require("../models/User.Schema");

const jwt = require("jsonwebtoken");

const routes = Router();

routes.get("/", (req, res) => {
  res.send("routes");
});

routes.post("/getposts", async (req, res) => {
  try {
    let { token } = req.body;

    let { email } = await jwt.verify(token, "secretkey");

    let temp = await User.find({ email: { $eq: email } });
    console.log(temp);

    let posts = temp[0].posts;

    res.send(posts);
  } catch (error) {
    res.status(500).send("error");
  }
});
//register
routes.post("/users/register", async (req, res) => {
  try {
    let email = req.body.email;

    if (await User.findOne({ email: { $eq: email } })) {
      return res.send("user alardy exists ");
    } else {
      let data = await User.create(req.body);
      res.status(200).send(data);
    }
  } catch (error) {
    // console.log(error);
    res.status(500).send("error occured");
  }
});

// login

routes.post("/users/login", async (req, res) => {
  try {
    let { email } = req.body;

    let temp = await User.find({ email: { $eq: email } });

    if (temp) {
      let token = jwt.sign({ email: email }, "secretkey");
      res.send(token);
    } else {
      res.status(500).send("use is not there");
    }
  } catch (error) {
    res.status(500).send("error");
  }
});

routes.post("/posts", async (req, res) => {
  try {
    let { title, body, device, token } = req.body;

    let { email } = await jwt.verify(token, "secretkey");

    let temp = await User.find({ email: { $eq: email } });

    let posts = temp[0].posts;

    posts.push({ title, body, device });

    let check = await User.updateOne(
      { email: { $eq: email } },
      {
        $set: {
          posts: posts,
        },
      }
    );

    console.log(posts);

    res.send("working");
  } catch (error) {
    res.status(500).send("err");
  }
});

// update

// routes.patch("posts/update", async (req, res) => {
//   try {
//     let { tittle, body, deivce, token } = req.body;

//     let { email } = await jwt.verify(token, "secretkey");

//     let temp = await User.find({ email: { $eq: email } });

//     let posts = temp[0].posts;

//     posts.push(tittle, body, deivce);

//     let check = await User.updateOne(
//       { email: { $eq: email } },
//       {
//         $set: {
//           posts: posts,
//         },
//       }
//     );

//     console.log(posts);

//     res.send("working");
//   } catch (error) {
//     res.status(500).send("err");
//   }
// });

// delete

routes.delete("/posts/delete:id", async (req, res) => {
  let { id } = req.params;
  console.log(id);

  try {
    let temp = await User.findByIdAndDelete(id);

    res.status(200).send(id);
  } catch (error) {
    res.status(500).send("err");
  }
});

module.exports = routes;