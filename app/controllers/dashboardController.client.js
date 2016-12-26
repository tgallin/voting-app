'use strict';

/*global $*/
/*global appUrl*/
var apiAllPolls = appUrl + '/api/allpolls';
var apiMyPolls = appUrl + '/api/mypolls';
var apiRemovePoll = appUrl + '/api/removePoll';
var userId = "";

function getPolls(currentUserOnly) {

   var apiPollsToUse = currentUserOnly ? apiMyPolls : apiAllPolls;
   $("#noPolls").hide();

   $.getJSON({
      url: apiPollsToUse,
      success: function(polls) {
         var items = [];
         var item = "";

         var createdDate;
         polls.forEach(function(p) {
            item = "";
            if (p.created) {
               createdDate = new Date(p.created).toLocaleDateString();
            }
            else {
               createdDate = "";
            }
            item = "<tr id=\"" + p._id + "\"><td><a href=\"/polldetail/" + p._id + "\">" + p.question + "</a></td><td>" + createdDate + "</td>";
            if (currentUserOnly || (userId !== "" && userId === p.user_id)) {
               item += "<td><a class=\"removePollLink\"><i class=\"fa fa-trash-o\" aria-hidden=\"true\"></i></a></td>";
            }
            item += "</tr>";
            items.push(item);
         });

         if (items.length > 0) {
            $("#polls").html(items);
         }
         else {
            var message = currentUserOnly ? "you haven't created any poll yet !" : "No poll has been created yet !";
            $("#noPolls").text(message);
            $("#noPolls").show();
         }
      }
   });
}

function removePoll(pollId) {
   $.getJSON({
      url: apiRemovePoll + "/" + pollId,
      success: function(poll) {
         if (poll && poll._id === pollId) {
            $('#' + pollId).remove();
         }
      }
   });
}

$(document).ready(function() {
   $("#newPollDiv").hide();
   userId = $("#userId").val();
   getPolls(false);
});

function activateItem(itemId) {
   $("#allpollsitem").removeClass('active');
   $("#mypollsitem").removeClass('active');
   $("#newpollitem").removeClass('active');
   $("#" + itemId).addClass('active');
}

$("#allpolls").click(function() {
   getPolls(false);

   $("#pollsList").show();
   $("#newPollDiv").hide();

   activateItem("allpollsitem");
   $("#pollsTitle").text("All polls");
});

$("#mypolls").click(function() {
   getPolls(true);
   $("#pollsList").show();
   $("#newPollDiv").hide();

   activateItem("mypollsitem");

   $("#pollsTitle").text("My polls");
});

$("#newpoll").click(function() {
   $("#pollsList").hide();
   $("#newPollDiv").show();

   activateItem("newpollitem");
});

$("#addOption").click(function() {
   var newOptionId = $('.pollOption').length + 1;
   $("#addOption").before('<div class="form-group"><input type="text" class="form-control pollOption" id="option' + newOptionId + '" name="option' + newOptionId + '" placeholder="another possible option" required><div class="help-block with-errors"></div></div>');
   $('#newPollForm').validator('update');
});

$("#polls").on("click", "tr .removePollLink", function() {
   var pollId = $(this).closest("tr").attr('id');
   if (pollId) {
      bootbox.confirm({
         size: "small",
         message: "Are you sure?",
         callback: function(confirmed) {
            if (confirmed) {
               removePoll(pollId);
            }
         }
      })

   }
});
