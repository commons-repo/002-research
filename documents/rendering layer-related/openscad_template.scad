//0
//Function to close a loop by appending the first point at the end

function close_path(points_set) = 
    concat(points_set, [points_set[0]]);

//writing style
//new_points_set = close_path(points_set); //the function will act on points_set and create a new set closing the path, and then save it in a new variable called new_points_set

/**********************/

//1
//Global rendering settings

//fragment number: larger = smoother 
//$fn = 100;  
//fragment angle: smaller = smoother
//$fa = 2; 
//fragment size: smaller = finer resolution
//$fs = 0.5;

/**********************/

//2
//Reusable module to visualize a list of points as spheres

module show_points(points_set, radius = 2, fragments = 50, col = "blue") {
    color(col)
    for (pt = points_set) {
        // Auto-handle 2D or 3D input
        pt_z = len(pt) > 2 ? pt[2] : 0;
        translate([pt[0], pt[1], pt_z])
            sphere(r = radius, $fn = fragments);
    }
}

//writing style
//show_points(points_set, radius = 2, fragments = 50, col = "blue");

/**********************/

//3
//2D path using hull between circles at each point

module create_2d_path_circle(points_set, width = 2, fragments = 100) {
    for (i = [0 : len(points_set) - 2]) {
        hull() {
            translate(points_set[i]) 
                circle(d = width, $fn = fragments);
            translate(points_set[i + 1]) 
                circle(d = width, $fn = fragments);
        }
    }
}

//writing style
//create_2d_path_circle(points_set, width = 2, fragments = 100);

/**********************/

//4
//Generic polygon module with dynamic input

module create_polygon(points_set) {
    polygon(points = points_set);
}
//writing style
//create_polygon(points_set);

/**********************/

//5
//3D wrapper for extruding a 2D path

module extrude_2d_path_circle(points_set, width = 2, fragments = 100, height = 10) {
    linear_extrude(height = height)
        create_2d_path_circle(points_set, width, fragments);
}

//writing style
//extrude_2d_path_circle(points_set, width = 2, fragments = 100, height = 10);

/**********************/

//6
//3D wrapper for extruding a polygon

module extrude_polygon(points_set, height = 10) {
    linear_extrude(height = height)
        create_polygon(points_set);
}

//writing style
//extrude_polygon(points_set, height = 10);

/**********************/

//7
//Hull-based 2D path using square blocks instead of circles
module create_2d_path_box(points_set, width = 2) {
    for (i = [0 : len(points_set) - 2]) {
        hull() {
            translate(points_set[i])
                square([width, width], center = true);
            translate(points_set[i + 1])
                square([width, width], center = true);
        }
    }
}

//writing style
//create_2d_path_box(points_set, width = 2);

/**********************/

//8
//Extrude hull-based 2D path using square blocks instead of circles

module extrude_2d_path_box(points_set, width = 2, height = 10) {
    linear_extrude(height = height)
        create_2d_path_box(points_set, width);
}

//writing style
//extrude_2d_path_box(points_set, width = 2, height = 10);

/**********************/

//9
//Flexible 2D path using hull between shapes (circle or square)
//- 'width' defines diameter or size
//- 'shape' can be "circle" or "square"

module create_2d_path(points_set, width = 2, fragments = 100, shape = "circle") {
    for (i = [0 : len(points_set) - 2]) {
        hull() {
            if (shape == "circle") {
                translate(points_set[i])
                    circle(d = width, $fn = fragments);
                translate(points_set[i + 1])
                    circle(d = width, $fn = fragments);
            } else if (shape == "square") {
                translate(points_set[i])
                    square([width, width], center = true);
                translate(points_set[i + 1])
                    square([width, width], center = true);
            } else {
                echo("⚠ Unsupported shape: ", shape);
            }
        }
    }
}

//writing style
//create_2d_path(points_set, width = 4, fragments = 60, shape = "circle");
//create_2d_path(points_set, width = 4, shape = "square");

/**********************/

//10
////3D wrapper for extruding a flexible 2D path
//- 'shape' can be "circle" or "square"
//- 'width' is the size (diameter or side length)
//- 'fragments' affects smoothness (for circles)

module extrude_2d_path(points_set, width = 2, fragments = 100, height = 10, shape = "circle") {
    linear_extrude(height = height)
        create_2d_path(points_set, width, fragments, shape);
}

//writing style
//extrude_2d_path(points_set, width = 2, fragments = 100, height = 10, shape = "circle");
//extrude_2d_path(points_set, width = 2, height = 10, shape = "square");

