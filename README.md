# Palette Picker

## Endpoints

URL|Verb|Options|Sample Response
---|---|---|---
`http://localhost3001/api/v1/projects` | Not needed | Array of all existing projects `{projectId: 1, name: Project 1}`
`http://localhost3001/api/v1/palettes` | Not needed | Array of all existing palettes `{"project_id": 6, "name": "palette 1", "color_1": "#31393C", "color_2": "#2176FF", "color_3": "#33A1FD", "color_4": "#FDCA40", "color_5": "#F79824", "project_name": "test 2"}`

### GET requests

All GET requests return an array of objects


Return all palettes regardless of which project they fall under


Return all palettes for a specified project by project id
http://localhost3001/api/v1/projects/:id/palettes

Return project by project id
http://localhost3001/api/v1/projects/:id

Return palette by palette id
http://localhost3001/api/v1/palettes/:id


### POST requests


Create new project
http://localhost3001/api/v1/projects
Requires a body object with a key of "name" and value as a string

```
{
  "name": "Nathan"
}
```

Create new palette
http://localhost3001/api/v1/palettes
Requires a body object
project_id must be an existing project id and must be a number
all other values must be a string

```
{
"project_id": 6,
"name": "palette 1",
"color_1": "#31393C",
"color_2": "#2176FF",
"color_3": "#33A1FD",
"color_4": "#FDCA40",
"color_5": "#F79824",
"project_name": "test 2"
}
```

### PATCH requests

Patch existing projects
http://localhost3001/api/v1/projects/:id

Requires a body object with a name that does not match any other project name
```
{
  "name": "new project name"
}
```

Patch existing pallete
http://localhost3001/api/v1/palettes/:id

Requires project_id to be the id of an existing body as a number
name and all five colors must be a string
```
{
"project_id": 5,
"name": "palette 1",
"color_1": "#31393C",
"color_2": "#2176FF",
"color_3": "#33A1FD",
"color_4": "#FDCA40",
"color_5": "#F79824"
}
```

### DELETE requests

Delete palette by id
http://localhost3001/api/v1/palettes/:id




Delete project by id
http://localhost3001/api/v1/projects/:id

Removes project and all palettes with its project_id
