// =====================================================
// ADMIN DETAILS
// =====================================================

const ADMIN_EMAIL = "admin@gmail.com";
const ADMIN_PASSWORD = "admin123";


// =====================================================
// LOCAL STORAGE FUNCTIONS
// =====================================================

function getUsers() {

    return JSON.parse(
        localStorage.getItem("fitnessUsers")
    ) || [];

}


function saveUsers(users) {

    localStorage.setItem(
        "fitnessUsers",
        JSON.stringify(users)
    );

}


function currentUser() {

    return localStorage.getItem("currentUser");

}


function userKey(type) {

    return "fitness_" +
           type +
           "_" +
           currentUser();

}


// =====================================================
// LOGIN / SIGNUP DISPLAY
// =====================================================

function showLogin() {

    document
        .getElementById("loginBox")
        .classList
        .remove("hidden");

    document
        .getElementById("signupBox")
        .classList
        .add("hidden");

}


function showSignup() {

    document
        .getElementById("loginBox")
        .classList
        .add("hidden");

    document
        .getElementById("signupBox")
        .classList
        .remove("hidden");

}


// =====================================================
// SIGNUP
// =====================================================

function signup() {

    let name =
        document.getElementById("signupName")
        .value.trim();

    let email =
        document.getElementById("signupEmail")
        .value.trim()
        .toLowerCase();

    let password =
        document.getElementById("signupPassword")
        .value;

    let message =
        document.getElementById("signupMessage");


    if (
        name === "" ||
        email === "" ||
        password === ""
    ) {

        message.textContent =
            "Please fill all fields.";

        message.style.color = "#e74c3c";

        return;
    }


    if (password.length < 6) {

        message.textContent =
            "Password must contain at least 6 characters.";

        message.style.color = "#e74c3c";

        return;
    }


    if (email === ADMIN_EMAIL) {

        message.textContent =
            "This email is reserved for admin.";

        message.style.color = "#e74c3c";

        return;
    }


    let users = getUsers();


    let existingUser =
        users.find(function(user) {

            return user.email === email;

        });


    if (existingUser) {

        message.textContent =
            "Account already exists.";

        message.style.color = "#e74c3c";

        return;
    }


    let newUser = {

        name: name,

        email: email,

        password: password,

        registeredDate:
            new Date().toLocaleDateString()

    };


    users.push(newUser);

    saveUsers(users);


    message.textContent =
        "Account created successfully!";

    message.style.color = "#1abc9c";


    document.getElementById("signupName").value = "";
    document.getElementById("signupEmail").value = "";
    document.getElementById("signupPassword").value = "";


    setTimeout(showLogin, 1200);

}


// =====================================================
// LOGIN
// =====================================================

function login() {

    let email =
        document.getElementById("loginEmail")
        .value.trim()
        .toLowerCase();

    let password =
        document.getElementById("loginPassword")
        .value;

    let message =
        document.getElementById("loginMessage");


    // ADMIN LOGIN

    if (
        email === ADMIN_EMAIL &&
        password === ADMIN_PASSWORD
    ) {

        localStorage.setItem("loggedIn", "true");
        localStorage.setItem("userRole", "admin");


        document
            .getElementById("authContainer")
            .classList
            .add("hidden");

        document
            .getElementById("adminApp")
            .classList
            .remove("hidden");


        loadAdminData();

        return;
    }


    // USER LOGIN

    let users = getUsers();


    let user =
        users.find(function(user) {

            return (
                user.email === email &&
                user.password === password
            );

        });


    if (!user) {

        message.textContent =
            "Invalid email or password.";

        message.style.color = "#e74c3c";

        return;
    }


    localStorage.setItem("loggedIn", "true");
    localStorage.setItem("userRole", "user");
    localStorage.setItem("currentUser", email);


    document
        .getElementById("authContainer")
        .classList
        .add("hidden");

    document
        .getElementById("userApp")
        .classList
        .remove("hidden");


    document
        .getElementById("userName")
        .textContent =
        user.name;


    loadUserData();

}


// =====================================================
// LOGOUT
// =====================================================

function logout() {

    localStorage.removeItem("loggedIn");
    localStorage.removeItem("userRole");
    localStorage.removeItem("currentUser");


    document
        .getElementById("userApp")
        .classList
        .add("hidden");

    document
        .getElementById("adminApp")
        .classList
        .add("hidden");

    document
        .getElementById("authContainer")
        .classList
        .remove("hidden");


    document.getElementById("loginEmail").value = "";
    document.getElementById("loginPassword").value = "";

}


// =====================================================
// USER NAVIGATION
// =====================================================

function showUserSection(sectionId) {

    let sections =
        document.querySelectorAll(".user-section");


    sections.forEach(function(section) {

        section.classList.add("hidden");

    });


    document
        .getElementById(sectionId)
        .classList
        .remove("hidden");


    if (sectionId === "reportsSection") {

        updateProgress();

    }

}


// =====================================================
// ADMIN NAVIGATION
// =====================================================

function showAdminSection(sectionId) {

    let sections =
        document.querySelectorAll(".admin-section");


    sections.forEach(function(section) {

        section.classList.add("hidden");

    });


    document
        .getElementById(sectionId)
        .classList
        .remove("hidden");

}


// =====================================================
// SAVE DAILY ACTIVITY
// =====================================================

function saveActivity() {

    let steps =
        Number(
            document.getElementById("stepsInput").value
        );

    let heartRate =
        Number(
            document.getElementById("heartRateInput").value
        );

    let sleep =
        Number(
            document.getElementById("sleepInput").value
        );


    if (
        steps < 0 ||
        heartRate < 0 ||
        sleep < 0
    ) {

        alert("Please enter valid activity values.");

        return;
    }


    let activity = {

        steps: steps || 0,

        heartRate: heartRate || 0,

        sleep: sleep || 0

    };


    localStorage.setItem(
        userKey("activity"),
        JSON.stringify(activity)
    );


    loadActivity();

    alert("Activity saved successfully!");

}


// =====================================================
// LOAD ACTIVITY
// =====================================================

function loadActivity() {

    let data =
        localStorage.getItem(
            userKey("activity")
        );


    if (!data) {
        return;
    }


    let activity =
        JSON.parse(data);


    document.getElementById("stepsDisplay")
        .textContent = activity.steps;

    document.getElementById("heartRateDisplay")
        .textContent =
        activity.heartRate || "--";

    document.getElementById("sleepDisplay")
        .textContent = activity.sleep;


    document.getElementById("stepsInput")
        .value = activity.steps;

    document.getElementById("heartRateInput")
        .value = activity.heartRate;

    document.getElementById("sleepInput")
        .value = activity.sleep;


    generateRecommendation(activity);

}


// =====================================================
// ADD WORKOUT
// =====================================================

function addWorkout() {

    let name =
        document.getElementById("workoutName")
        .value.trim();

    let duration =
        Number(
            document.getElementById("workoutDuration")
            .value
        );

    let calories =
        Number(
            document.getElementById("workoutCalories")
            .value
        );


    if (
        name === "" ||
        duration <= 0 ||
        calories <= 0
    ) {

        alert("Please enter valid workout details.");

        return;
    }


    let workouts =
        JSON.parse(
            localStorage.getItem(
                userKey("workouts")
            )
        ) || [];


    workouts.push({

        name: name,

        duration: duration,

        calories: calories,

        date:
            new Date().toLocaleDateString()

    });


    localStorage.setItem(
        userKey("workouts"),
        JSON.stringify(workouts)
    );


    document.getElementById("workoutName").value = "";
    document.getElementById("workoutDuration").value = "";
    document.getElementById("workoutCalories").value = "";


    displayWorkouts();

}


// =====================================================
// DISPLAY WORKOUTS
// =====================================================

function displayWorkouts() {

    let table =
        document.getElementById("workoutTable");


    table.innerHTML = "";


    let workouts =
        JSON.parse(
            localStorage.getItem(
                userKey("workouts")
            )
        ) || [];


    if (workouts.length === 0) {

        table.innerHTML =
            "<tr><td colspan='3'>No workout records yet.</td></tr>";

        return;
    }


    workouts.forEach(function(workout) {

        let row =
            document.createElement("tr");


        row.innerHTML =
            "<td>" + workout.name + "</td>" +
            "<td>" + workout.duration + " min</td>" +
            "<td>" + workout.calories + " kcal</td>";


        table.appendChild(row);

    });

}


// =====================================================
// ADD FOOD
// =====================================================

function addFood() {

    let name =
        document.getElementById("foodName")
        .value.trim();

    let calories =
        Number(
            document.getElementById("foodCalories")
            .value
        );


    if (
        name === "" ||
        calories <= 0
    ) {

        alert("Please enter valid food details.");

        return;
    }


    let foods =
        JSON.parse(
            localStorage.getItem(
                userKey("foods")
            )
        ) || [];


    foods.push({

        name: name,

        calories: calories,

        date:
            new Date().toLocaleDateString()

    });


    localStorage.setItem(
        userKey("foods"),
        JSON.stringify(foods)
    );


    document.getElementById("foodName").value = "";
    document.getElementById("foodCalories").value = "";


    displayFoods();

}


// =====================================================
// DISPLAY FOOD
// =====================================================

function displayFoods() {

    let table =
        document.getElementById("foodTable");


    table.innerHTML = "";


    let foods =
        JSON.parse(
            localStorage.getItem(
                userKey("foods")
            )
        ) || [];


    let total = 0;


    if (foods.length === 0) {

        table.innerHTML =
            "<tr><td colspan='2'>No food records yet.</td></tr>";

    }


    foods.forEach(function(food) {

        total += Number(food.calories);


        let row =
            document.createElement("tr");


        row.innerHTML =
            "<td>" + food.name + "</td>" +
            "<td>" + food.calories + " kcal</td>";


        table.appendChild(row);

    });


    document.getElementById("totalCalories")
        .textContent = total;

    document.getElementById("caloriesDisplay")
        .textContent = total;

}


// =====================================================
// SAVE GOALS
// =====================================================

function saveGoals() {

    let stepGoal =
        Number(
            document.getElementById("stepGoal").value
        );

    let calorieGoal =
        Number(
            document.getElementById("calorieGoal").value
        );

    let sleepGoal =
        Number(
            document.getElementById("sleepGoal").value
        );


    if (
        stepGoal <= 0 ||
        calorieGoal <= 0 ||
        sleepGoal <= 0
    ) {

        alert("Please enter valid goals.");

        return;
    }


    let goals = {

        stepGoal: stepGoal,

        calorieGoal: calorieGoal,

        sleepGoal: sleepGoal

    };


    localStorage.setItem(
        userKey("goals"),
        JSON.stringify(goals)
    );


    displayGoals();

    alert("Fitness goals saved successfully!");

}


// =====================================================
// DISPLAY GOALS
// =====================================================

function displayGoals() {

    let data =
        localStorage.getItem(
            userKey("goals")
        );


    if (!data) {
        return;
    }


    let goals =
        JSON.parse(data);


    document.getElementById("stepGoalDisplay")
        .textContent = goals.stepGoal;

    document.getElementById("calorieGoalDisplay")
        .textContent = goals.calorieGoal;

    document.getElementById("sleepGoalDisplay")
        .textContent = goals.sleepGoal;


    document.getElementById("stepGoal")
        .value = goals.stepGoal;

    document.getElementById("calorieGoal")
        .value = goals.calorieGoal;

    document.getElementById("sleepGoal")
        .value = goals.sleepGoal;


    updateProgress();

}


// =====================================================
// PROGRESS REPORT
// =====================================================

function updateProgress() {

    let activity =
        JSON.parse(
            localStorage.getItem(
                userKey("activity")
            )
        ) || {
            steps: 0,
            sleep: 0
        };


    let goals =
        JSON.parse(
            localStorage.getItem(
                userKey("goals")
            )
        );


    if (!goals) {
        return;
    }


    let foods =
        JSON.parse(
            localStorage.getItem(
                userKey("foods")
            )
        ) || [];


    let calories = 0;


    foods.forEach(function(food) {

        calories += Number(food.calories);

    });


    let stepPercent =
        (activity.steps / goals.stepGoal) * 100;

    let caloriePercent =
        (calories / goals.calorieGoal) * 100;

    let sleepPercent =
        (activity.sleep / goals.sleepGoal) * 100;


    stepPercent = Math.min(stepPercent, 100);
    caloriePercent = Math.min(caloriePercent, 100);
    sleepPercent = Math.min(sleepPercent, 100);


    document.getElementById("stepProgress")
        .style.width = stepPercent + "%";

    document.getElementById("calorieProgress")
        .style.width = caloriePercent + "%";

    document.getElementById("sleepProgress")
        .style.width = sleepPercent + "%";


    document.getElementById("stepPercentage")
        .textContent =
        Math.round(stepPercent) + "%";

    document.getElementById("caloriePercentage")
        .textContent =
        Math.round(caloriePercent) + "%";

    document.getElementById("sleepPercentage")
        .textContent =
        Math.round(sleepPercent) + "%";

}


// =====================================================
// RECOMMENDATIONS
// =====================================================

function generateRecommendation(activity) {

    let recommendation =
        document.getElementById("recommendation");


    let messages = [];


    if (activity.steps < 5000) {

        messages.push(
            "👟 Try to increase your daily steps."
        );

    } else {

        messages.push(
            "👟 Good job on your step count!"
        );

    }


    if (activity.sleep < 7) {

        messages.push(
            "😴 Try to get at least 7 hours of sleep."
        );

    } else {

        messages.push(
            "😴 Your sleep duration looks good."
        );

    }


    if (activity.heartRate > 100) {

        messages.push(
            "❤️ Consider resting and monitoring your heart rate."
        );

    } else {

        messages.push(
            "❤️ Continue monitoring your heart rate."
        );

    }


    recommendation.innerHTML =
        messages.join("<br><br>");

}


// =====================================================
// LOAD USER DATA
// =====================================================

function loadUserData() {

    loadActivity();

    displayWorkouts();

    displayFoods();

    displayGoals();

}


// =====================================================
// ADMIN DATA
// =====================================================

function loadAdminData() {

    let users = getUsers();


    document.getElementById("totalUsers")
        .textContent = users.length;


    let workoutCount = 0;
    let foodCount = 0;
    let goalCount = 0;


    users.forEach(function(user) {

        let email = user.email;


        let workouts =
            JSON.parse(
                localStorage.getItem(
                    "fitness_workouts_" + email
                )
            ) || [];


        let foods =
            JSON.parse(
                localStorage.getItem(
                    "fitness_foods_" + email
                )
            ) || [];


        let goals =
            localStorage.getItem(
                "fitness_goals_" + email
            );


        workoutCount += workouts.length;

        foodCount += foods.length;


        if (goals) {
            goalCount++;
        }

    });


    document.getElementById("totalWorkouts")
        .textContent = workoutCount;

    document.getElementById("totalFoodRecords")
        .textContent = foodCount;

    document.getElementById("totalGoals")
        .textContent = goalCount;


    displayAdminUsers();

    displayAdminRecords();

}


// =====================================================
// ADMIN USERS
// =====================================================

function displayAdminUsers() {

    let table =
        document.getElementById("adminUserTable");


    table.innerHTML = "";


    let users = getUsers();


    if (users.length === 0) {

        table.innerHTML =
            "<tr><td colspan='4'>No registered users.</td></tr>";

        return;
    }


    users.forEach(function(user) {

        let row =
            document.createElement("tr");


        row.innerHTML =

            "<td>" + user.name + "</td>" +

            "<td>" + user.email + "</td>" +

            "<td>" + user.registeredDate + "</td>" +

            "<td>" +
            "<button class='small-btn' " +
            "onclick=\"deleteUser('" +
            user.email +
            "')\">" +
            "Delete" +
            "</button>" +
            "</td>";


        table.appendChild(row);

    });

}


// =====================================================
// DELETE USER
// =====================================================

function deleteUser(email) {

    let confirmDelete =
        confirm(
            "Are you sure you want to delete this user?"
        );


    if (!confirmDelete) {
        return;
    }


    let users = getUsers();


    users =
        users.filter(function(user) {

            return user.email !== email;

        });


    saveUsers(users);


    localStorage.removeItem(
        "fitness_activity_" + email
    );

    localStorage.removeItem(
        "fitness_workouts_" + email
    );

    localStorage.removeItem(
        "fitness_foods_" + email
    );

    localStorage.removeItem(
        "fitness_goals_" + email
    );


    loadAdminData();

}


// =====================================================
// ADMIN FITNESS RECORDS
// =====================================================

function displayAdminRecords() {

    let container =
        document.getElementById("adminRecords");


    container.innerHTML = "";


    let users = getUsers();


    if (users.length === 0) {

        container.innerHTML =
            "<p>No user records available.</p>";

        return;
    }


    users.forEach(function(user) {

        let email = user.email;


        let activity =
            JSON.parse(
                localStorage.getItem(
                    "fitness_activity_" + email
                )
            );


        let workouts =
            JSON.parse(
                localStorage.getItem(
                    "fitness_workouts_" + email
                )
            ) || [];


        let foods =
            JSON.parse(
                localStorage.getItem(
                    "fitness_foods_" + email
                )
            ) || [];


        let goals =
            JSON.parse(
                localStorage.getItem(
                    "fitness_goals_" + email
                )
            );


        let card =
            document.createElement("div");


        card.className =
            "admin-record-card";


        let activityText =
            activity
            ? "Steps: " + activity.steps +
              " | Heart Rate: " +
              activity.heartRate +
              " BPM | Sleep: " +
              activity.sleep +
              " hours"
            : "No activity data";


        let goalText =
            goals
            ? "Steps: " + goals.stepGoal +
              " | Calories: " +
              goals.calorieGoal +
              " | Sleep: " +
              goals.sleepGoal
            : "No goals set";


        card.innerHTML =

            "<h3>" + user.name + "</h3>" +

            "<p><strong>Email:</strong> " +
            user.email +
            "</p>" +

            "<p><strong>Activity:</strong> " +
            activityText +
            "</p>" +

            "<p><strong>Workouts:</strong> " +
            workouts.length +
            " workout(s)</p>" +

            "<p><strong>Diet:</strong> " +
            foods.length +
            " food record(s)</p>" +

            "<p><strong>Goals:</strong> " +
            goalText +
            "</p>";


        container.appendChild(card);

    });

}


// =====================================================
// AUTO LOGIN
// =====================================================

window.addEventListener(
    "DOMContentLoaded",
    function() {

        let loggedIn =
            localStorage.getItem("loggedIn");

        let role =
            localStorage.getItem("userRole");


        if (
            loggedIn === "true" &&
            role === "admin"
        ) {

            document
                .getElementById("authContainer")
                .classList
                .add("hidden");


            document
                .getElementById("adminApp")
                .classList
                .remove("hidden");


            loadAdminData();

        }


        else if (
            loggedIn === "true" &&
            role === "user"
        ) {

            let email = currentUser();

            let users = getUsers();


            let user =
                users.find(function(u) {

                    return u.email === email;

                });


            if (user) {

                document
                    .getElementById("authContainer")
                    .classList
                    .add("hidden");


                document
                    .getElementById("userApp")
                    .classList
                    .remove("hidden");


                document
                    .getElementById("userName")
                    .textContent = user.name;


                loadUserData();

            }

        }

    }
);