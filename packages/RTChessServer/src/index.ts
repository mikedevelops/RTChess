import express from "express";

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.static("dist/public"));

// TODO: Sync this with the client!
// This now exists in 2 places!
const client = `
<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Text Adventure</title>
    <style>
        @font-face {
            font-family: "dos";
            src: url("../fonts/Perfect DOS VGA 437.ttf")
        }

        * { margin: 0; padding: 0; }
        canvas { width: 100%; height: 100%; position: fixed; }
    </style>
</head>
<body>
    <!-- offscreen text so we have the DOS font in the first frame of the game -->
    <span style="position: absolute; left: -999px; font-family: 'dos';">FONT CACHE</span>
    <canvas id="stage"></canvas>
    <script src="index.js"></script>
</body>
</html>
`;

app.get("/", (req, res) => {
  res.send(client);
});

app.listen(PORT, () => {
  console.log("litsening!");
});
