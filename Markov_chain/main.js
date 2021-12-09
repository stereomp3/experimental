var aRate, bRate;
$(document).ready(function () {
    $("button").click(function () {
        aRate = $("#aRate").val();
        bRate = $("#bRate").val();
        f();
    });
});
var Pss = { // person state
    A: 1,
    B: 2
};

function f() {
    var res = System.runRounds(),
        data = [];
    for (var i = 0; i <= System.NumRounds; i++) {
        data.push({
            Terms: i,
            A: res[i].A,
            B: res[i].B
        });
    }
    showResult(data);
}

var System = (function () {
    var People = [];

    var runRounds = function () {
        var result = [];
        initialize();
        result.push({
            A: System.NumPeople,
            B: System.NumPeople
        }); // initial
        for (var i = 0; i < System.NumRounds; i++) {
            result.push(aRound());
        }
        return result;
    };

    var initialize = function () {
        People = [];
        for (var i = 0; i < System.NumPeople; i++) {
            People.push(new Person(Pss.A));
            People.push(new Person(Pss.B));
        }
    };

    var aRound = function () {
        People.forEach(function (ps) {
            ps.change();
        });
        return count();
    };

    var count = function () {
        var Pp = People;
        var data = {
            A: 0,
            B: 0
        };
        for (var i in Pp) {
            if (Pp[i].State == Pss.A) data.A++;
            else data.B++;
        }
        return data;
    };

    return {
        NumPeople: 10000,
        NumRounds: 30,
        runRounds: runRounds
    };
})();

function Person(state) {
    this.State = state;
}

Person.prototype.change = function () {
    this.Rate = (this.State == Pss.A) ? aRate : bRate;
    this.State = (Math.random() < this.Rate) ? 3 ^ this.State : this.State;
}

function showResult(data) {
    var margin = {
            top: 20,
            right: 20,
            bottom: 30,
            left: 40
        },
        width = 900 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    var x0 = d3.scale.ordinal()
        .rangeRoundBands([0, width - 20], .1);

    var x1 = d3.scale.ordinal();

    var y = d3.scale.linear()
        .range([height, 0]);

    var color = d3.scale.ordinal()
        .range(["#aa4748", "#ff8c00"]);

    var xAxis = d3.svg.axis()
        .scale(x0)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .tickFormat(d3.format(".2s"));
    $("#Res").empty();

    var svg = d3.select("#Res").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var X_Names = ['A', 'B', ];

    data.forEach(function (d) {
        d.xs = X_Names.map(function (name) {
            return {
                name: name,
                value: +d[name]
            };
        });
    });

    x0.domain(data.map(function (d) {
        return d.Terms;
    }));
    x1.domain(X_Names).rangeRoundBands([0, x0.rangeBand()]);
    y.domain([0, d3.max(data, function (d) {
        return d3.max(d.xs, function (d) {
            return d.value;
        });
    })]);

    svg.append("g")
        .attr("class", "x axis")
        .call(xAxis)
        .attr("transform", "translate(0," + height + ")")
        .append("text")
        .attr("x", width + 10)
        .attr("y", 18)
        .style("text-anchor", "end")
        .text("Terms");

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("People");

    var terms = svg.selectAll(".terms")
        .data(data)
        .enter().append("g")
        .attr("class", "terms")
        .attr("transform", function (d) {
            return "translate(" + x0(d.Terms) + ",0)";
        });

    terms.selectAll("rect")
        .data(function (d) {
            return d.xs;
        })
        .enter().append("rect")
        .attr("width", x1.rangeBand())
        .attr("x", function (d) {
            return x1(d.name);
        })
        .attr("y", function (d) {
            return y(d.value);
        })
        .attr("height", function (d) {
            return height - y(d.value);
        })
        .style("fill", function (d) {
            return color(d.name);
        });

    var legend = svg.selectAll(".legend")
        .data(X_Names.slice().reverse())
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function (d, i) {
            return "translate(0," + i * 20 + ")";
        });

    legend.append("rect")
        .attr("x", width - 16)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", color);

    legend.append("text")
        .attr("x", width + 12)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function (d) {
            return d;
        });

};