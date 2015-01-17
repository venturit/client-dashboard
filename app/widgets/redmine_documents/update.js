widgets.redmine_documents = function(data, $) {
  var $target = $('#widget-' + data.id),
      rows = "",
      modals = "",
      totalDocuments;
  if (data.results && data.results.length > 0) {
    totalDocuments = 0;
    $.each(data.results, function(i, category) {
      rows += '<tr class="redmine-version"><td>' + category.name + '</td></tr>';
      $.each(category.documents, function(i, doc) {
        totalDocuments++;
        rows += '<tr >';
        rows += '<td class="redmine-title-td" data-toggle="modal" data-target="#redmine-document-' + doc.id + '"><div>' + doc.title + '</div><div class="redmine-document-description"><hr /></div></td>';
        rows += '</tr>';

        modals += '<div id="redmine-document-' + doc.id + '" class="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button><h3 id="myModalLabel">' + doc.title + '</h3></div><div class="modal-body">' + doc.description.replace(/(?:\r\n|\r|\n)/g, '<br />') + '</div></div>';
      });
    });
  } else if (data.error) {
    rows += '<tr><td><div class="alert alert-error" title="' + data.error + '">There was a problem retrieving documents</div></td></tr>'
  } else {
    rows += '<tr><td><div class="alert alert-success">No documents</div></td></tr>';
  }
  $target.find('.redmine-documents-table tbody').html(rows);
  $target.find('.redmine-documents-title .badge').html(totalDocuments || "N/A");
  $target.find('.refresh-service[data-service="redmine_documents"]').removeClass('disabled').siblings('.refresh-ok').show().delay('250').fadeOut();
  $target.find('.redmine-documents-modals').html(modals);
};
