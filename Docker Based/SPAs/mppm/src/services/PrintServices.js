import moment from "moment";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
export default {
  async printProjects(projSortType, projBreakType, documents, uniqueProjectTypes) {
    class Projrow {
      constructor(title, type, startdate, enddate, description, notes) {
        this.title = title;
        this.type = type;
        this.startdate = startdate;
        this.enddate = enddate;
        this.description = description;
        this.notes = notes;
      }
    }
    var i = 0;
    var j = 0;
    var title = "Projects by ";
    var byTitle = "Name";
    var uniques = [];
    var somerows = [];
    var projrows = [];
    for (i = 0; i < documents.length; i++) {
      projrows[i] = new Projrow(
        documents[i].title,
        documents[i].type,
        this.formatDate(documents[i].startdate),
        this.formatDate(documents[i].enddate),
        documents[i].description,
        documents[i].notes
      );
    }
    var colDefinition = [
      { dataKey: "title", header: "Title" },
      { dataKey: "type", header: "Type" },
      { dataKey: "startdate", header: "Start" },
      { dataKey: "enddate", header: "Finish" },
      { dataKey: "description", header: "Description" },
      { dataKey: "notes", header: "Notes" },
    ];
    if (projSortType === "Start Date") {
      byTitle = "Start Date";
      projrows.sort(function (a, b) {
        var projDateA = a.startdate;
        var projDateB = b.startdate;
        if (projDateA < projDateB) {
          return -1;
        }
        if (projDateA > projDateB) {
          return 1;
        }
        return 0;
      });
    }
    if (projSortType === "Type") {
      byTitle = "Type";
    }
    if (projSortType === "Name") {
      byTitle = "Name";
      projrows.sort(function (a, b) {
        var projNameA = a.title.toLowerCase();
        var projNameB = b.title.toLowerCase();
        if (projNameA < projNameB) {
          return -1;
        }
        if (projNameA > projNameB) {
          return 1;
        }
        return 0;
      });
    }
    var doc = new jsPDF("l", "pt");
    var newTitle = title + byTitle;
    doc.text(newTitle, 350, 30);
    if (
      projBreakType === "Continuous" ||
      projSortType === "Name" ||
      projSortType === "Start Date"
    ) {
      // @ts-ignore
      doc.autoTable({
        columns: colDefinition,
        body: projrows,
        styles: { cellPadding: 3, fontSize: 9 },
        columnStyles: {
          0: { cellWidth: 100 },
          1: { cellWidth: 80 },
          2: { cellWidth: 55 },
          3: { cellWidth: 55 },
          4: { cellWidth: 250 },
        },
        theme: "striped",
        didDrawPage: function (data) {
          // Footer
          var str = "Page " + doc.internal.getNumberOfPages();
          doc.setFontSize(9);
          var pageSize = doc.internal.pageSize;
          var pageHeight = pageSize.height
            ? pageSize.height
            : pageSize.getHeight();
          doc.text(str, data.settings.margin.left, pageHeight - 10);
        },
        margin: { top: 50 },
      });
    } else {
      uniques = uniqueProjectTypes;
      var k = 0;
      for (i = 0; i < uniques.length; i++) {
        for (j = 0; j < projrows.length; j++) {
          if (projrows[j].type === uniques[i]) {
            somerows[k] = new Projrow(
              projrows[j].title,
              projrows[j].type,
              projrows[j].startdate,
              projrows[j].enddate,
              projrows[j].description,
              projrows[j].notes
            );
            k++;
          }
        }
        doc.autoTable({
          columns: colDefinition,
          body: somerows,
          styles: { cellPadding: 3, fontSize: 9 },
          columnStyles: {
            0: { cellWidth: 100 },
            1: { cellWidth: 80 },
            2: { cellWidth: 55 },
            3: { cellWidth: 55 },
            4: { cellWidth: 250 },
          },
          theme: "striped",
          didDrawPage: function (data) {
            // Footer
            var str = "Page " + doc.internal.getNumberOfPages();
            doc.setFontSize(9);
            var pageSize = doc.internal.pageSize;
            var pageHeight = pageSize.height
              ? pageSize.height
              : pageSize.getHeight();
            doc.text(str, data.settings.margin.left, pageHeight - 10);
          },
          margin: { top: 50 },
        });
        if (projBreakType === "Page" && i < uniques.length - 1) {
          doc.addPage();
        }
        k = 0;
        somerows = [];
      }
    }
    doc.save("projects.pdf");
  },
  async printPurchases(
    purSortType,
    purBreakType,
    documents,
    uniquePurStore,
    uniquePurProjects,
    uniquePurManufacturer
  ) {
    class Purrow {
      constructor(
        num,
        date,
        store,
        item,
        desciption,
        manufacturer,
        unitcost,
        qty,
        notes,
        extendcost,
        project
      ) {
        this.num = num;
        this.date = date;
        this.store = store;
        this.item = item;
        this.desciption = desciption;
        this.manufacturer = manufacturer;
        this.unitcost = unitcost;
        this.qty = qty;
        this.notes = notes;
        this.extendcost = extendcost;
        this.project = project;
      }
    }
    const formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    });
    var title = "Purchases by ";
    var totalcost = 0;
    var extendcost = 0;
    var startRow = [];
    startRow[0] = 0;
    var uniques = [];
    var somerows = [];
    var i = 0;
    var j = 0;
    var k = 0;
    var purrows = [];
    var colDefinition = [
      { dataKey: "num", header: "#" },
      { dataKey: "date", header: "Date" },
      { dataKey: "store", header: "Store" },
      { dataKey: "item", header: "Item" },
      { dataKey: "desciption", header: "Description" },
      { dataKey: "manufacturer", header: "Manufacturer" },
      { dataKey: "unitcost", header: "Cost" },
      { dataKey: "qty", header: "Qty" },
      { dataKey: "extendcost", header: "Total" },
      { dataKey: "notes", header: "Notes" },
    ];
    var doc = new jsPDF("l", "pt");
    for (i = 0; i < documents.length; i++) {
      extendcost = documents[i].unitcost * documents[i].qty;
      totalcost += extendcost;
      purrows[i] = new Purrow(
        documents[i].num,
        this.formatDate(documents[i].date),
        documents[i].store,
        documents[i].item,
        documents[i].desciption,
        documents[i].manufacturer,
        formatter.format(documents[i].unitcost),
        documents[i].qty,
        documents[i].notes,
        (documents[i].extendcost = formatter.format(extendcost)),
        documents[i].project
      );
    }
    switch (purSortType) {
      case "Date":
        var byTitle = "Date";
        purrows.sort(function (a, b) {
          var purTypeA = a.date;
          var purTypeB = b.date;
          if (purTypeA < purTypeB) {
            return -1;
          }
          if (purTypeA > purTypeB) {
            return 1;
          }
          return 0;
        });
        break;
      case "Project":
        uniques = uniquePurProjects;
        var byTitle = "Project";
        purrows.sort(function (a, b) {
          var purTypeA = a.project.toLowerCase();
          var purTypeB = b.project.toLowerCase();
          if (purTypeA < purTypeB) {
            return -1;
          }
          if (purTypeA > purTypeB) {
            return 1;
          }
          return 0;
        });
        break;
      case "Manufacturer":
        uniques = uniquePurManufacturer;
        byTitle = "Manufacturer";
        purrows.sort(function (a, b) {
          var purTypeA = a.manufacturer.toLowerCase();
          var purTypeB = b.manufacturer.toLowerCase();
          if (purTypeA < purTypeB) {
            return -1;
          }
          if (purTypeA > purTypeB) {
            return 1;
          }
          return 0;
        });
        break;
      case "Store":
        uniques = uniquePurStore;
        byTitle = "Store";
        purrows.sort(function (a, b) {
          var purTypeA = a.store.toLowerCase();
          var purTypeB = b.store.toLowerCase();
          if (purTypeA < purTypeB) {
            return -1;
          }
          if (purTypeA > purTypeB) {
            return 1;
          }
          return 0;
        });
        break;
    } // end switch
    var newTitle = title + byTitle;
    doc.text(newTitle, 350, 30);
    if (purBreakType === "Continuous") {
      doc.autoTable({
        columns: colDefinition,
        body: purrows,
        styles: { cellPadding: 3, fontSize: 8 },
        columnStyles: {
          0: { halign: "right", cellWidth: 30 }, // num
          1: { cellWidth: 60 }, // date
          2: { cellWidth: 110 }, // store
          3: { cellWidth: 60 }, // item
          4: { cellWidth: 120 }, // description
          5: { cellWidth: 70 }, // manufacturer
          6: { halign: "right", cellWidth: 35 }, // unitcost
          7: { halign: "right", cellWidth: 20 }, // qty
          8: { halign: "right", cellWidth: 40 }, // extendcost
          9: { cellWidth: "auto" }, // notes
        },
        theme: "striped",
        didDrawPage: function (data) {
          // Footer
          var str = "Page " + doc.internal.getNumberOfPages();
          doc.setFontSize(9);
          var pageSize = doc.internal.pageSize;
          var pageHeight = pageSize.height
            ? pageSize.height
            : pageSize.getHeight();
          doc.text(str, data.settings.margin.left, pageHeight - 10);
        },
        margin: { top: 50 },
      });
      var finalY = doc.previousAutoTable.finalY;
      doc.setFontSize(10);
      var summary =
        "The number purchases made was " +
        purrows.length +
        " for a total cost of " +
        formatter.format(totalcost);
      doc.text(summary, 100, finalY + 20);
    } else {
      k = 0;
      var headerY = 0;
      doc.setFontSize(12);
      for (i = 0; i < uniques.length; i++) {
        headerY = 50;
        if (purBreakType !== "Page"){
        if (i !== 0) {
          headerY = doc.previousAutoTable.finalY + 15;
        }
        if (headerY + 50 > doc.internal.pageSize.height) {
          doc.addPage();
          headerY = 50;
        }}
        doc.text(uniques[i], 50, headerY);
        for (j = 0; j < purrows.length; j++) {
          if (
            (purSortType === "Project" && purrows[j].project === uniques[i]) ||
            (purSortType === "Store" && purrows[j].store === uniques[i]) ||
            (purSortType === "Manufacturer" &&
              purrows[j].manufacturer === uniques[i])
          ) {
            somerows[k] = new Purrow(
              purrows[j].num,
              purrows[j].date,
              purrows[j].store,
              purrows[j].item,
              purrows[j].desciption,
              purrows[j].manufacturer,
              purrows[j].unitcost,
              purrows[j].qty,
              purrows[j].notes,
              purrows[j].extendcost,
              purrows[j].project
            );
            k++;
          }
        }
        doc.autoTable({
          columns: colDefinition,
          body: somerows,
          startY : headerY + 10,
          styles: { cellPadding: 3, fontSize: 8 },
          columnStyles: {
            0: { halign: "right", cellWidth: 30 }, // num
            1: { cellWidth: 60 }, // date
            2: { cellWidth: 110 }, // store
            3: { cellWidth: 60 }, // item
            4: { cellWidth: 200 }, // description
            5: { cellWidth: 70 }, // manufacturer
            6: { halign: "right", cellWidth: 35 }, // unitcost
            7: { halign: "right", cellWidth: 20 }, // qty
            8: { halign: "right", cellWidth: 40 }, // extendcost
            9: { cellWidth: "auto" }, // notes
          },
          theme: "striped",
          didDrawPage: function (data) {
            // Footer
            var str = "Page " + doc.internal.getNumberOfPages();
            doc.setFontSize(9);
            var pageSize = doc.internal.pageSize;
            var pageHeight = pageSize.height
              ? pageSize.height
              : pageSize.getHeight();
            doc.text(str, data.settings.margin.left, pageHeight - 10);
          },
          margin: { top: 50 },
        });
        if (purBreakType === "Page" && i < uniques.length - 1) {
          headerY = 0;
          doc.addPage();
        }
        k = 0;
        somerows = [];
      }
    }
    doc.save("purchases.pdf");
  },
  printMrCompanies(documents) {
    class Mrco {
      constructor(name, type, website, email, phone, address, notes) {
        this.name = name;
        this.type = type;
        this.website = website;
        this.email = email;
        this.phone = phone;
        this.address = address;
        this.notes = notes;
      }
    }
    var colDefinition = [
      { dataKey: "name", header: "Name" },
      { dataKey: "type", header: "Type" },
      { dataKey: "website", header: "Website" },
      { dataKey: "email", header: "Email" },
      { dataKey: "phone", header: "Phone" },
      { dataKey: "address", header: "Address" },
      { dataKey: "notes", header: "Notes" },
    ];
    var doc = new jsPDF("l", "pt");
    var title = "Model Railroad Companies";
    doc.text(title, 350, 30);
    doc.autoTable({
      columns: colDefinition,
      body: documents,
      styles: { cellPadding: 3, fontSize: 8 },
      columnStyles: {
        0: { cellWidth: 100 }, // name
        1: { cellWidth: 50 }, // type
        2: { cellWidth: 130 }, // website
        3: { cellWidth: 100 }, // email
        4: { cellWidth: 70 }, // phone
        5: { cellWidth: 100 }, // address
        6: { cellWidth: "auto" }, // notes
      },
      theme: "striped",
      didDrawPage: function (data) {
        // Footer
        var str = "Page " + doc.internal.getNumberOfPages();
        doc.setFontSize(9);
        var pageSize = doc.internal.pageSize;
        var pageHeight = pageSize.height
          ? pageSize.height
          : pageSize.getHeight();
        doc.text(str, data.settings.margin.left, pageHeight - 10);
      },
    });
    doc.save("mrcos.pdf");
  },
  formatDate(unformatDate) {
    if (unformatDate === null || unformatDate === "") {
      return "";
    } else {
      return moment.utc(unformatDate).format("YYYY-MM-DD");
    }
  },
};
