const express = require('express');
const app = express();
const port = 3000;
const cors =require('cors');
const { Pool } = require('pg');

app.use(express.json());
app.use(cors());

const pool = new Pool({
    user: 'postgres.eqnhkezwawniaztwylra',
    host: 'aws-0-ap-southeast-1.pooler.supabase.com',
    database: 'postgres',
    password: 'smkn1kota12',
    port: 6543,
    ssl: {
        rejectUnauthorized: false
    }
});

// get data from database
app.get('/api/task', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM tasks');
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error fetching data:', err);
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});

// post data
app.post('/api/store-data', async (req, res) => {
    const { task_name, description, due_date } = req.body;
    const query = 'INSERT INTO tasks (task_name, description, due_date, status) VALUES ($1, $2, $3, \'Pending\') RETURNING *';
    const values = [task_name, description, due_date];
  
    try {
      const result = await pool.query(query, values);
      res.status(200).json({ message: 'Data stored successfully', data: result.rows[0] });
    } catch (error) {
      console.error('Error inserting data:', error);
      res.status(400).json({ message: 'Error inserting data', error });
    }
});
  
// Update data
app.put('/api/posts/:id', async (req, res) => {
    const { task_name, description, due_date } = req.body;
    const { id } = req.params;
    const query = 'UPDATE tasks SET task_name = $1, description = $2, due_date = $3 WHERE id = $4 RETURNING *';
    const values = [task_name, description, due_date, id];

    try {
        const result = await pool.query(query, values);
        if (result.rows.length === 0) {
            res.status(404).json({ error: 'Task not found' });
        } else {
            res.status(200).json({ message: 'Data updated successfully', data: result.rows[0] });
        }
    } catch (error) {
        console.error('Error updating data:', error);
        res.status(400).json({ error: 'Failed to update data' });
    }
});

// Delete data
app.delete('/api/posts/:id', async (req, res) => {
    try {
        let {id} = req.params
        const query = 'DELETE FROM tasks WHERE id = $1 RETURNING *';
        const result = await pool.query(query, [id]);

        if (!result.rowCount){
            return res.status(404).json({ error: "Tasks Not Found" })
        }

        res.status(200).json({ message: "Data Deleted Successfully", data: result.rows[0] });
    } catch (error) {
        res.status(400).json({error: "Failed to Deleted Data"})
    }
})


// Complete Task
app.put('/api/completed/:id', async (req, res) => {
    let {id} = req.params;
    const query = "UPDATE tasks SET status = \'Completed'\ where id = $1 RETURNING *";

    try {
        const result = await pool.query(query, [id]);

        if(result.rowCount === 0){
            return res.status(404).json({error: 'Task not found'});
        }

        res.status(200).json({message:"Task masrked as complete", data: result.rows[0] })
    } catch (error) {
        console.error('Error updating tasks status:', error);
        res.status(404).json({ error: 'Failed to mark task as complete' });
    }
})


app.get('/', (req, res) => {
    res.send('Hello, Im connect to mysql');
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})

