## Get Started :

Make request to the base url:

#### ``` Heroku URL ```

## Projects

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

| Name | Type | Description |
| ---- |:----:|:-----------:|
| id | Integer | Unique ID for each project |
| project_title | String | Name of the Project |



## Palettes

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

The response sends a single palette from the database if it exist

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


## Contributors

#### Michael King-Stockton
#### Kristen Hallstrom