# Palette Picker

This was a two week paired project where we built a backend for a user to create projects and color palettes. THe front e nd hasa random color generator and the user can create new project folders, and add new palettes to specific folders. The user can add projects and palettes, delete projects and palettes, and edit existing projects and palettes.

## Created By

{Nathan Froehlich}(https://github.com/Nathan-Froeh)

Colby Allen 

## Built With

Express.js

Knex

PostgreSQL

Deployed to Heroku

## Endpoints

URL|Verb|Options|Sample Response
---|---|---|---
`http://localhost3001/api/v1/projects`| GET | Not needed | Array of all existing projects `{"project_id": 1, "name": Project 1}`
`http://localhost3001/api/v1/palettes` | GET | Not needed | Array of all existing palettes `{"project_id": 6, "name": "palette 1", "color_1": "#31393C", "color_2": "#2176FF", "color_3": "#33A1FD", "color_4": "#FDCA40", "color_5": "#F79824", "project_name": "test 2"}`
`http://localhost3001/api/v1/projects/:id/palettes` | GET | Not neeed | Array of all existing `{"project_id": 6, "name": "palette 1", "color_1": "#31393C", "color_2": "#2176FF", "color_3": "#33A1FD", "color_4": "#FDCA40", "color_5": "#F79824", "project_name": "test 2"}`
`http://localhost3001/api/v1/projects/:id` | GET | Not needed | Single project by id `{"project_id": 1, "name": Project 1}`
`http://localhost3001/api/v1/palettes/:id` | GET | Not needed | Single palette by id `{"project_id": 6, "name": "palette 1", "color_1": "#31393C", "color_2": "#2176FF", "color_3": "#33A1FD", "color_4": "#FDCA40", "color_5": "#F79824", "project_name": "test 2"}`
`http://localhost3001/api/v1/projects` | POST | `{"name": <String>}` | New project `{"project_id": 2, "Name": "Project 2"}`
`http://localhost3001/api/v1/palettes` | POST | `{"name": <String>, "color_1": <String>, "color_2": <String>, "color_3": <String>, "color_4": <String>, "color_5": <String>, "project_name": <String>}`| New Pallete `{"project_id": 7, "name": "palette 20", "color_1": "#31393C", "color_2": "#2176FF", "color_3": "#33A1FD", "color_4": "#FDCA40", "color_5": "#F79824", "project_name": "test 2"}`
`http://localhost3001/api/v1/projects/:id` | PATCH | `{"name": <String>}` | Updated Project `{"project_id": 1, "name": "new project name"}`
`http://localhost3001/api/v1/palettes/:id` | PATCH | `{"project_id: <Integer>, "name": <String>, "color_1": <String>, "color_2": <String>, "color_3": <String>, "color_4": <String>, "color_5": <String>}` | Updated Palette `{"project_id": 7, "name": "New Project 20", "color_1": "#31393C", "color_2": "#2176FF", "color_3": "#33A1FD", "color_4": "#FDCA40", "color_5": "#F79824", "project_name": "test 2"}`
`http://localhost3001/api/v1/palettes/:id` | DELETE | Not needed | Status code of '204' and string of which palette was deleted
`http://localhost3001/api/v1/projects/:id` | DELETE | Not needed | Status code of '204' and string of which palette was deleted

