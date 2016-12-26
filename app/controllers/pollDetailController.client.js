'use strict';

/*global $*/
/*global appUrl*/
var apiPollDetail = appUrl + '/api/polldetail';
var apiAddOption = appUrl + '/api/addOption';
var apiVote = appUrl + '/api/vote';

var pollChart;
var newOptionIsNotBlank = false;


function updateUIFrom(poll) {
   var labels = [];
   var votes = [];
   var colors = [];
   var optionsHtml = "";
   poll.options.forEach(function(option, i) {
      labels.push(option.label);
      votes.push(option.voteCount);
      /* global chartColors*/
      colors.push(chartColors[i]);
      optionsHtml += "<option value=\"" + option._id + "\">" + option.label + "</option>";
   });
   $("#options").html(optionsHtml);

   var totalVotes = votes.reduce(function(a, b) {
      return a + b;
   }, 0);
   if (totalVotes > 0) {
      if (pollChart) {
         pollChart.data.labels = labels;
         pollChart.data.datasets[0].data = votes;
         pollChart.data.datasets[0].backgroundColor = colors;
         pollChart.data.datasets[0].hoverBackgroundColor = colors;
         pollChart.update();
      }
      else {
         var ctx = $("#pollChart");
         var data = {
            labels: labels,
            datasets: [{
               data: votes,
               backgroundColor: colors,
               hoverBackgroundColor: colors
            }]
         };
         /* global Chart*/
         pollChart = new Chart(ctx, {
            type: 'doughnut',
            data: data
         });
         $("#pollChart").show();
         $("#noVote").hide();
      }
   }
   else {
      $("#pollChart").hide();
      $("#noVote").show();
   }
}

function getPoll(id) {

   $("#noPolls").hide();

   $.getJSON({
      url: apiPollDetail + "/" + id,
      success: function(poll) {
         /*{"__v":0,"question":"what's your favorite colour ?","user_id":"58416a547d49390d3de57e9f","_id":"584fd4b6c81a6b06f055b9f3"
         ,"created":"2016-12-13T11:00:06.711Z","options":[{"label":"red","voteCount":0,"_id":"584fd4b6c81a6b06f055b9f6"},{"label":"blue","voteCount":0,"_id":"584fd4b6c81a6b06f055b9f5"},{"label":"yellow","voteCount":0,"_id":"584fd4b6c81a6b06f055b9f4"}]}*/

         $("#question").text(poll.question);
         var pollDetailUrl = appUrl + '/polldetail/' + id;
         $('#tweet-quote').attr('href', 'https://twitter.com/intent/tweet?url=' + encodeURIComponent(pollDetailUrl) + '&hashtags=poll&related=freecodecamp&text=' + encodeURIComponent(poll.question));
         updateUIFrom(poll);
      }
   });
}

function addOption(pollId, option) {
   $.post(
      apiAddOption, {
         pollId: pollId,
         newOption: option
      },
      function(poll) {
         updateUIFrom(poll);
      },
      "json"
   );
}

function vote(pollId, optionId) {
   $.post(
      apiVote, {
         pollId: pollId,
         optionId: optionId
      },
      function(poll) {
         if (pollChart) {
            var votes = [];
            poll.options.forEach(function(option, i) {
               votes.push(option.voteCount);
            });

            pollChart.data.datasets[0].data = votes;
            pollChart.update();
         }
         else {
            updateUIFrom(poll);
         }

      },
      "json"
   );
}

$(document).ready(function() {
   /*global pollId*/
   var pollId = $("#pollId").val();
   if (pollId) {
      getPoll(pollId);
      $("#pollDetails").show();
      $("#notFound").hide();
   }
   else {
      $("#pollDetails").hide();
      $("#notFound").show();
   }

});

$('#voteBtn').click(function() {
   // Get some values from elements on the page
   var pollId = $("#pollId").val();
   var optionId = $("#options").find(":selected").val();
   if (optionId && pollId) {
      vote(pollId, optionId);
   }
});

$('#addOptionBtn').click(function() {
   $('#voteForm').validator('validate');
   if (newOptionIsNotBlank) {
      // Get some values from elements on the page
      var option = $('#voteForm').find("input[name='newOption']").val();
      var pollId = $("#pollId").val();
      addOption(pollId, option);
   }

});

$('#voteForm').on('invalid.bs.validator', function(e) {
   if (e.relatedTarget.name === "newOption") {
      newOptionIsNotBlank = false;
   }
});

$('#voteForm').on('valid.bs.validator', function(e) {
   if (e.relatedTarget.name === "newOption") {
      newOptionIsNotBlank = true;
   }
});
