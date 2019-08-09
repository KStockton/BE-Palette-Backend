## Get Started :
[![Build Status](https://travis-ci.org/KStockton/BE-Palette-Picker.svg?branch=master)](https://travis-ci.org/KStockton/BE-Palette-Picker)
Make request to the base url:

### ``` Heroku URL ```
https://backendpalettelit.herokuapp.com/

## Projects

| Name | Type | Description |
| ---- |:----:|:-----------:|
| id | Integer | Unique ID for each project |
| project_title | String | Name of the Project |

#### Get ```api/v1/projects``` (All Projects)

The response sends all the projects from the database. 

Response example:

```  
[
    {
        "id": 3,
        "project_title": "Kristen's Project",
        "created_at": "2019-07-02T22:35:05.760Z",
        "updated_at": "2019-07-02T22:35:05.760Z"
    },
    {
        "id": 4,
        "project_title": "Michael's Website",
        "created_at": "2019-07-02T22:35:05.762Z",
        "updated_at": "2019-07-02T22:35:05.762Z"
    }
]
```

#### Get ```api/v1/projects/:id``` (A Project)

This response sends the requested project from the database. 

Response example:

```  
[
    {
        "id": 3,
        "project_title": "Kristen's Project",
        "created_at": "2019-07-02T22:35:05.760Z",
        "updated_at": "2019-07-02T22:35:05.760Z"
    },
]
```
#### POST ```api/v1/projects``` (Post a new project)

A user can post a new project. Must be formatted in JSON with correct ```project_title``` key.

| Name | Type | Description |
| ---- |:----:|:-----------:|
| project_title | String | Name of the Project |

Example post:

```
{
    "project_title": "Support our Schools"
}
```

Response example: 

```
{
    "id": 5086
}
```

#### PUT ```api/v1/projects/:id``` (Update a single project)

A user can update a project title. Project title must exist.

| Name | Type | Description |
| ---- |:----:|:-----------:|
| project_title | String | Name of the Project |

Example put:

```
{
	"project_title": "Backup Website Colors"
}
```

Example Response:

```
{
    "id": 5085,
    "project_title": "Backup Website Colors",
    "created_at": "2019-07-06T19:03:07.669Z",
    "updated_at": "2019-07-06T19:03:07.669Z"
}
```

#### Delete ```api/v1/projects/:id``` (Delete a single project)

A user can delete a specific project and associated plattes

Response is 204 status code.

## Palettes

| Name | Type | Description |
| ---- |:----:|:-----------:|
| id | Integer | Unique ID for each project |
| project_title | String | Name of the Project |
| color_1 | String | Hex color |
| color_2 | String | Hex color |
| color_3 | String | Hex color |
| color_4 | String | Hex color |
| color_5 | String | Hex color |
| palette_title | String | Name of the Palette |


#### Get ```api/v1/palettes``` (All Palettes)

The response sends all the palettes from the database.

```
[
    {
        "id": 4,
        "palette_title": "Summer Breeze",
        "color_1": "#6deef9",
        "color_2": "#eac761",
        "color_3": "#50c1b9",
        "color_4": "#bcbc45",
        "color_5": "#535275",
        "project_id": 3,
        "created_at": "2019-07-02T22:35:05.764Z",
        "updated_at": "2019-07-02T22:35:05.764Z"
    },
    {
        "id": 5,
        "palette_title": "Autumn",
        "color_1": "#6deef9",
        "color_2": "#eac761",
        "color_3": "#d33a37",
        "color_4": "#d7632c",
        "color_5": "#f3b307",
        "project_id": 3,
        "created_at": "2019-07-02T22:35:05.764Z",
        "updated_at": "2019-07-02T22:35:05.764Z"
    },
    {
        "id": 6,
        "palette_title": "Website Background",
        "color_1": "#6deef9",
        "color_2": "#eac761",
        "color_3": "#79b9b8",
        "color_4": "#bcbc45",
        "color_5": "#535275",
        "project_id": 4,
        "created_at": "2019-07-02T22:35:05.766Z",
        "updated_at": "2019-07-02T22:35:05.766Z"
    }
]
```

#### Get ```api/v1/palettes/:id``` (Specific Palette)

The response sends a single palette from the database if it exist.

Example Response:

```
[
    {
        "id": 4,
        "palette_title": "Summer Breeze",
        "color_1": "#6deef9",
        "color_2": "#eac761",
        "color_3": "#50c1b9",
        "color_4": "#bcbc45",
        "color_5": "#535275",
        "project_id": 3,
        "created_at": "2019-07-02T22:35:05.764Z",
        "updated_at": "2019-07-02T22:35:05.764Z"
    }
]
```

#### POST ```/api/v1/palettes ``` (Post a new palette)

A user can post a new palette to the database.

Example post:

```
{
    "palette_title": "Summer Breeze",
    "color_1": "#6deef9",
    "color_2": "#eac761",
    "color_3": "#50c1b9",
    "color_4": "#bcbc45",
    "color_5": "#535275",
    "project_title": "Michael Strikes Back"
}
```

Response example: 

```
{
    "id": 5086
}
```

#### PUT ```/api/v1/palettes/:id``` (Update a palette)

A user can update a palette within the database.

Example put before request:

```
{
	"palette_title": "Summer Breeze",
	"color_1": "#31kf3",
	"color_2": "#42393",
	"color_3": "#82848",
	"color_4": "#93590",
	"color_5": "#8590m"
}
```

Example Request: 

```
{
	"palette_title": "Summer",
	"color_1": "#test",
	"color_2": "#test",
	"color_3": "#test",
	"color_4": "#test",
	"color_5": "same"
}
```

Example response:

```
{
    "id": 7450,
    "palette_title": "Summer",
    "color_1": "#test",
    "color_2": "#test",
    "color_3": "#test",
    "color_4": "#test",
    "color_5": "same",
    "project_id": 5086,
    "created_at": "2019-07-06T19:54:57.991Z",
    "updated_at": "2019-07-06T19:54:57.991Z"
}
```

#### DELETE ```/api/v1/pallettes/:id ``` (Delete a palette)

A user can delete a palette from the database.

Response is 204 status code.


## Contributors

#### Michael King-Stockton
#### Kristen Hallstrom