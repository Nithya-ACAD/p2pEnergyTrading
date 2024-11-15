const express = require('express');
const cors = require('cors');
const searchRoutes = require('./src/routes/searchController'); // Adjust the path as needed

const app = express();
app.use(cors());
app.use(express.json());

// Attach routes
app.use('/search', searchRoutes);

const PORT = process.env.PORT || 3030;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
