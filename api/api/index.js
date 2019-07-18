const express = require('express');
const helmet = require('helmet');
const axios = require('axios');
const bodyParser = require('body-parser')

const client = axios.create({
  baseURL: 'https://api.prosperworks.com/developer_api',
  headers: {
    'X-PW-AccessToken': process.env.COPPER_CRM_API_KEY,
    'X-PW-Application': 'developer_api',
    'X-PW-UserEmail': process.env.COPPER_CRM_USEREMAIL,
    'Content-Type': 'application/json' 
  }
})

const app = express();

app.use(helmet());

app.get('/ping', (req, res) => res.status(200).send('pong'))

app.post('/submit_lead', bodyParser(), async (req, res, next) => {
  try {
    const { name, email, companyName: company_name, title, tags } = req.body

    console.log('creating lead in copper', JSON.stringify({
      name,
      email: {
        email,
        category: 'work'
      },
      company_name,
      title,
      tags,
      date_created: Date.now()
    }))

    await client.post('/v1/leads', {
      name,
      email: {
        email,
        category: 'work'
      },
      company_name,
      title,
      tags,
      date_created: Date.now()
    })

    console.log('lead created in copper')

    return res.status(201).send({
      success: true
    })
  } catch (err) {
    console.log('error creating lead in copper')
    console.error(err)
    next(err)
  }
})

module.exports = app;
