# be-palette-picker

[![Build Status](https://travis-ci.org/geet084/be-palette-picker.svg?branch=master)](https://travis-ci.com/geet084/be-palette-picker)

## Base URL
```https://be-palette-picker.herokuapp.com```

## GET
> List of endpoints for getting data related to projects and palettes

### ```GET /api/v1/projects```
> Get data on all projects   
**Example Response**
```
[
  {
      "id": 9,
      "project_name": "Weather App",
      "created_at": "2019-03-23T15:44:06.303Z",
      "updated_at": "2019-03-23T15:44:06.303Z"
  },
  {
      "id": 10,
      "project_name": "Personal Website",
      "created_at": "2019-03-23T15:44:06.309Z",
      "updated_at": "2019-03-23T15:44:06.309Z"
  },
  {
      "id": 12,
      "project_name": "Nap Tracking App",
      "created_at": "2019-03-24T21:10:58.005Z",
      "updated_at": "2019-03-24T21:10:58.005Z"
  }
]
```  
### ```GET /api/v1/projects/:id/palettes```
> Get data on all palettes for an associated project    
**Example Response**
```
[
  {
      "id": 10,
      "palette_name": "Vibrant",
      "color_1": "99cc32",
      "color_2": "01df33",
      "color_3": "ee22ff",
      "color_4": "76fd3c",
      "color_5": "7a1b9f",
      "project_id": 10,
      "created_at": "2019-03-23T15:44:06.320Z",
      "updated_at": "2019-03-23T15:44:06.320Z"
  },
  {
      "id": 12,
      "palette_name": "Muted Colors",
      "color_1": "643eed",
      "color_2": "111eee",
      "color_3": "d3a2c1",
      "color_4": "ee21aa",
      "color_5": "9d519a",
      "project_id": 10,
      "created_at": "2019-03-23T15:44:06.322Z",
      "updated_at": "2019-03-23T15:44:06.322Z"
  }
]
```    
### ```GET /api/v1/projects/:id```  
>Returns information on the specific project based on the dynamic ID   
Request: ```/api/v1/projects/10```  
**Example Response** 
```
{
  "id": 10,
  "project_name": "Interesting Side Project",
  "created_at": "2019-03-23T15:44:06.309Z",
  "updated_at": "2019-03-23T15:44:06.309Z"
}
```  
### ```GET /api/v1/projects/:id/palette```  
> Returns information on a specific palette based on the project ID, when given an ID for an associated project
Request: ```/api/v1/projects/10/palettes/12```  
**Example Response**  
```
{
  "id": 12,
  "palette_name": "Muted Colors",
  "color_1": "643eed",
  "color_2": "111eee",
  "color_3": "d3a2c1",
  "color_4": "ee21aa",
  "color_5": "9d519a",
  "project_id": 10,
  "created_at": "2019-03-23T15:44:06.322Z",
  "updated_at": "2019-03-23T15:44:06.322Z"
}
```
## POST
> User can post a new project and a new palette. If the post is successful, the user will be prompted with a message of their success

### ```POST /api/v1/projects```  
**Required Input for Request Body**  

| Name       | Type          | Description  |
| ------------ | :---: | --- |
| `project_name`| `string` | Name of the new project |

  
**Example Response**
```
{
  "id": 13,
  "project_name": "E-Commerce Website"
}
```  

### ```POST /api/v1/projects/:id/palettes```   
**Required Input for Request Body**  

| Name       | Type          | Description  |
| ------------- | :------------: | ----- |
| `palette_name` | `string` | Name of of the new palette |
| `color_1`      | `string`      |   Hexcode of color in palette |
| `color_2`  | `string`     |    Hexcode of color in palette |
|`color_3` | `string` |  Hexcode of color in palette |
|`color_4` | `string` |  Hexcode of color in palette |
|`color_5` | `string` |  Hexcode of color in palette |
   

**Example Response**
```
{
  "id": 13,
  "palette_name": "Flashy Tones",
  "color_1": "#D12E39",
  "color_2": "#6746B5",
  "color_3": "#CB4F68",
  "color_4": "#ABF90D",
  "color_5": "#0189F7"
}
```  
## DELETE  
> Users can delete palettes and projects. NOTE: If a user deletes a project, all associated palettes will also be deleted

**Required:**
The ID of the project to be deleted or the ID of the project and the specific palette ID 
### ```DELETE /api/v1/projects/:id```  
### ```DELETE /api/v1/projects/:id/palttes/:p_id```  
**Example Response**
```
Deleted project with ID of 13
```
```
Deleted palette with ID of 13
```

## PUT
> Users can edit projects and palettes.

### ```PUT /api/v1/projects/:id```  
**Required Input for Request Body**  

| Name       | Type          | Description  |
| ------------- | :-------------: | ----- |
| `project_name`| `string` | Name of the new project |

  
**Example Response**
```
{
  "id": 13,
  "project_name": "Newly Updated E-Commerce Website"
}
```  

### ```PUT /api/v1/projects/:id/palettes/p_id```   
**Required Input for Request Body**  

| Name       | Type          | Description  |
| ------------- | :-------------: | ----- |
| `palette_name`      | `string` | Name of of the new palette |
| `color_1`      | `string`      |   Hexcode of color in palette |
| `color_2`  | `string`     |    Hexcode of color in palette |
| `color_3` | `string` |  Hexcode of color in palette |
| `color_4` | `string` |  Hexcode of color in palette |
| `color_5` | `string` |  Hexcode of color in palette |
   

**Example Response**
```
{
  "id": 13,
  "palette_name": "Newly Updated Tones",
  "color_1": "#B42E39",
  "color_2": "#C846B5",
  "color_3": "#DDAF68",
  "color_4": "#BF390D",
  "color_5": "#0089F7"
}
```  
