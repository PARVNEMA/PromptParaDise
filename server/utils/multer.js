import multer from "multer";

import fs from "fs";

if (!fs.existsSync("uploads")) {
	fs.mkdirSync("uploads");
}

const upload = multer({ dest: "uploads/" });

export default upload;
