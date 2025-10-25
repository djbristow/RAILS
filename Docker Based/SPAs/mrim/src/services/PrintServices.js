/* import { useAarCodesStore } from "@/stores/aarCodes";
import { useCompaniesStore } from "@/stores/companies";
import { useImagesStore } from "@/stores/images";
import { useRSStore } from "@/stores/rs";
import { mapActions } from "pinia"; */
import { jsPDF } from 'jspdf';
import { autoTable } from 'jspdf-autotable';
import moment from "moment";
export default {
 
  printCarCards(rs) {
    const cardWidth = 3.25;
    const cardHeight = 3.5;
    const margin = 0.25;
    const cardsPerRow = 3;
    const cardsPerPage = 6; 
    const doc = new jsPDF('l', 'in', 'letter');
    let cardCount = 0;
    let xPos = margin;
    let yPos = margin;
    rs.forEach(car => {
      if (cardCount >= cardsPerPage) {
        doc.addPage();
        cardCount = 0;
        xPos = margin;
        yPos = margin;
      }
      this.drawCard(doc, car, xPos, yPos);
      cardCount++;
      xPos += cardWidth + margin;
      if (cardCount % cardsPerRow === 0) {
        xPos = margin;
        yPos += cardHeight + margin;
      }
    });
    doc.save('car_cards.pdf');
  },
  drawCard(doc, car, x, y) {
    const cardWidth = 3.25;
    const cardHeight = 3.5;
    const fontSize = 10;
    const lineHeight = 0.15; // inches
    doc.setLineWidth(0.01);
    doc.rect(x, y, cardWidth, cardHeight); // Card border
    // Add Logo (replace with your actual logo image path)
/*     const logoImg = new Image(); 
    logoImg.src = 'path/to/your/logo.png'; // Replace with your logo path
    doc.addImage(logoImg, 'PNG', x + cardWidth - 0.7, y + 0.1, 0.6, 0.6);  */
    doc.setFontSize(14); 
    doc.setFont(undefined, 'bold');
    doc.text(`${car.roadName} ${car.roadNumber}`, x + 0.1, y + 0.3);
    doc.line(x, y + 0.35, x + cardWidth, y + 0.35);
    doc.setFontSize(12); 
    doc.setFont(undefined, 'normal'); 
    let currentY = y + lineHeight + 0.5; // Start content below the top edge
    this.addText(doc, `Color: ${car.color}`, x + 0.1, currentY, fontSize);
    currentY += lineHeight;
    this.addText(doc, `AAR: ${car.aarCode}`, x + 0.1, currentY, fontSize);
    currentY += lineHeight;
    this.addText(doc, `Description: ${car.description}`, x + 0.1, currentY, fontSize);
    currentY += lineHeight;
    this.addText(doc, `Capacity: ${car.capacity}`, x + 0.1, currentY, fontSize);
    currentY += lineHeight;
    this.addText(doc, `Builder: ${car.bldr}`, x + 0.1, currentY, fontSize);
    currentY += lineHeight;
    this.addText(doc, `Built: ${this.formatDate(car.bltDate)}`, x + 0.1, currentY, fontSize);
    currentY += lineHeight;
    this.addText(doc, `LT Weight: ${car.ltWeight}`, x + 0.1, currentY, fontSize);
    currentY += lineHeight;
    this.addText(doc, `Load Limit: ${car.loadLimit}`, x + 0.1, currentY, fontSize);
    currentY += lineHeight;
    this.addText(doc, `Last Maint: ${this.formatDate(car.lastMaintDate)}`, x + 0.1, currentY, fontSize);
    currentY += lineHeight;
    this.addText(doc, `Status: ${car.rsStatus}`, x + 0.1, currentY, fontSize);
    currentY += lineHeight;   
  },
  addText(doc, text, x, y, fontSize) {
    doc.setFontSize(fontSize);
    doc.text(text, x, y);
  },
  printAarCodes(documents) {
    class Aarrow {
      constructor(aarCode, rollingstockType, description) {
        this.aarCode = aarCode;
        this.rollingstockType = rollingstockType;
        this.description = description;
      }
    }
    var i = 0;
    var aarrows = [];
    for (i = 0; i < documents.length; i++) {
      aarrows[i] = new Aarrow(
        documents[i].aarCode,
        documents[i].rollingstockType,
        documents[i].description
      );
    }
    var columns = [
      { header: "AAR", dataKey: "aarCode" },
      { header: "RS Type", dataKey: "rollingstockType" },
      { header: "Description", dataKey: "description" },
    ];
    var doc = new jsPDF("l", "pt");
    doc.text("AAR Codes Report", 350, 30);
    // @ts-ignore
    autoTable(doc, {
      columns: columns,
      body: aarrows,
      styles: { cellPadding: 3, fontSize: 9 },
      columnStyles: {
        0: { cellWidth: 60 },
        1: { cellWidth: 80 },
      },
      theme: "striped",
      margin: { top: 50 },
    });
    doc.save("aarcodes.pdf");
  },
  printCompanies(documents) {
    class Corow {
      constructor(shortName, longName, industryType, industryLocation) {
        this.shortName = shortName;
        this.longName = longName;
        this.industryType = industryType;
        this.industryLocation = industryLocation;
      }
    }
    var i = 0;
    var corows = [];
    for (i = 0; i < documents.length; i++) {
      corows[i] = new Corow(
        documents[i].shortName,
        documents[i].longName,
        documents[i].industryType,
        documents[i].industryLocation
      );
    }
    var columns = [
      { header: "Title", dataKey: "shortName" },
      { header: "Name", dataKey: "longName" },
      { header: "Type", dataKey: "industryType" },
      { header: "Location", dataKey: "industryLocation" },
    ];
    var doc = new jsPDF("l", "pt");
    doc.text("Companies Report", 350, 30);
    // @ts-ignore
    autoTable(doc, {
      columns: columns,
      body: corows,
      styles: { cellPadding: 3, fontSize: 10 },
      columnStyles: {
        0: { cellWidth: 60 },
      },
      theme: "striped",
      margin: { top: 50 },
    });
    doc.save("companies.pdf");
  },
  async importImage(imagePath) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = reject;
      image.src = imagePath;
    });
  },
  async getBase64StringFromDataURL(imgUrl, {mode = 'no-cors'} = {}) {
    let image = await fetch(imgUrl);
    let blob = await image.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  },
  async printImages(images, uniqueCatImage, rs) {
    var i = 0;
    let categories = uniqueCatImage;
    var doc = new jsPDF("p", "pt");
    let pageHeight = doc.internal.pageSize.height;
    let pageWidth = doc.internal.pageSize.width;
    let y = 70;
    let pageCount = 1;
    doc.text("Images Report", 225, 35);
    doc.setFontSize(10);
    doc.text("Page " + pageCount, 35, pageHeight - 10);
    let imageRoot = import.meta.env.VITE_MRFM_URI + "/";
    console.log("Image Root URL: ", imageRoot);
    for (let k = 0; k < categories.length; k++) {
      if (k > 0) {
        doc.addPage();
        pageCount++;
        doc.text("Page " + pageCount, 35, pageHeight - 10);
        y = 70;
      }
      doc.setFontSize(12).setFont(undefined, "bold");
      doc.text(categories[k], 200, 50);
      doc.setFontSize(10).setFont(undefined, "normal");
      for (i = 0; i < images.length; i++) {
        if (images[i].category == categories[k]) {
          let imagePic = await this.importImage(imageRoot + images[i].fileName);
          let imgHeight = imagePic.height;
          let imgWidth = imagePic.width;
          let imageData = await this.getBase64StringFromDataURL(
            imageRoot + images[i].fileName
          );
          let imgData = imageData.replace(/^data:.+;base64,/, "");
          let imgW = pageWidth / 2 - 35;
          let imgH = imgHeight * (imgW / imgWidth);
          let rollingstock = rs.filter(
            (rs) => rs.imageID === images[i].fileName
          );
          let rsText = "";
          let rsLines = [];
          let notesLines = [];
          let rsH = 30;
          let notesH = 0;
          let sectionH = 0;
          if (rollingstock.length > 0) {
            let j = 0;
            rsText =
              "RS: " +
              rollingstock[0].roadName +
              " " +
              rollingstock[0].roadNumber;
            for (j = 1; j < rollingstock.length; j++) {
              rsText = rsText + ", " + rollingstock[j].roadNumber;
            }
            if (rsText.length > 50) {
              rsLines = doc.splitTextToSize(rsText, 260);
              rsH = 40 + rsLines.length * 10;
            } else if (rsText.length > 3) {
              rsLines[0] = rsText;
              rsH = 45;
            } else {
              rsH = 30;
            }
          }
          if (images[i].notes.length > 50) {
            notesLines = doc.splitTextToSize("Notes: " + images[i].notes, 260);
            notesH = 40 + notesLines.length * 10;
          } else {
            notesLines[0] = "Notes: " + images[i].notes;
            notesH = 30;
          }
          if (imgH > rsH + notesH) {
            sectionH = imgH;
          } else {
            sectionH = rsH + notesH;
          }
          if (y + sectionH > pageHeight - 50) {
            doc.addPage();
            pageCount++;
            doc.text("Page " + pageCount, 35, pageHeight - 10);
            y = 35;
          }
          doc.setFont(undefined, "bold");
          doc
            .text("Title: " + images[i].title, 35, y)
            .setFont(undefined, "normal");
          doc.text("File: " + images[i].fileName, 35, y + 15);
          if (rsH > 0) doc.text(rsLines, 35, y + 30);
          if (notesLines[0].length > 7) doc.text(notesLines, 35, y + rsH);
          doc.addImage(imgData, "JPEG", imgW + 35, y - 7, imgW, imgH);
          y = y + sectionH + 20;
        }
      }
    }
    doc.save("images.pdf");
  },
  printRollingstock(
    sortBy,
    breakType,
    documents,
    uniqueRsRoadName,
    uniqueRsAarCode,
    uniqueRsStatus
  ) {
    class Rsrow {
      constructor(
        roadName,
        roadNumber,
        color,
        aarCode,
        description,
        capacity,
        bldr,
        bltDate,
        ltWeight,
        loadLimit,
        lastMaintDate,
        rsStatus
      ) {
        this.roadName = roadName;
        this.roadNumber = roadNumber;
        this.color = color;
        this.aarCode = aarCode;
        this.description = description;
        this.capacity = capacity;
        this.bldr = bldr;
        this.bltDate = bltDate;
        this.ltWeight = ltWeight;
        this.loadLimit = loadLimit;
        this.lastMaintDate = lastMaintDate;
        this.rsStatus = rsStatus;
      }
    }
    var i = 0;
    var j = 0;
    var title = "Rolling Stock Report by ";
    var byTitle = "Road Name";
    var uniques = null;
    var somerows = [];
    var rsrows = [];
    for (i = 0; i < documents.length; i++) {
      rsrows[i] = new Rsrow(
        documents[i].roadName,
        documents[i].roadNumber,
        documents[i].color,
        documents[i].aarCode,
        documents[i].description,
        documents[i].capacity,
        documents[i].bldr,
        this.formatDate(documents[i].bltDate),
        documents[i].ltWeight,
        documents[i].loadLimit,
        this.formatDate(documents[i].lastMaintDate),
        documents[i].rsStatus
      );
    }
    var columns = [
      { header: "Road", dataKey: "roadName" },
      { header: "Number", dataKey: "roadNumber" },
      { header: "AAR", dataKey: "aarCode" },
      { header: "Description", dataKey: "description" },
      { header: "Color", dataKey: "color" },
      { header: "Builder", dataKey: "bldr" },
      { header: "Built", dataKey: "bltDate" },
      { header: "Capacity", dataKey: "capacity" },
      { header: "Empty", dataKey: "ltWeight" },
      { header: "Max", dataKey: "loadLimit" },
      { header: "Maintenance", dataKey: "lastMaintDate" },
      { header: "Status", dataKey: "rsStatus" },
    ];
    if (sortBy === "AAR Codes") {
      byTitle = "AAR Code";
      rsrows.sort(function (a, b) {
        var aarCodeA = a.aarCode;
        var aarCodeB = b.aarCode;
        if (aarCodeA < aarCodeB) {
          return -1;
        }
        if (aarCodeA > aarCodeB) {
          return 1;
        }
        return 0;
      });
    }
    if (sortBy === "Status") {
      byTitle = "RS Status";
      rsrows.sort(function (a, b) {
        var rsStatusA = a.rsStatus;
        var rsStatusB = b.rsStatus;
        if (rsStatusA < rsStatusB) {
          return -1;
        }
        if (rsStatusA > rsStatusB) {
          return 1;
        }
        return 0;
      });
    }
    console.log("breakType: " + breakType);
    console.log("length of RS: " + rsrows.length);
    var doc = new jsPDF("l", "pt");
    var newTitle = title + byTitle;
    doc.text(newTitle, 350, 30);
    if (breakType === "Continuous") {
      // @ts-ignore
      autoTable(doc,{
        columns: columns,
        body: rsrows,
        styles: { cellPadding: 3, fontSize: 9 },
        columnStyles: {
          0: { cellWidth: 50 },
          1: { cellWidth: 50 },
          2: { cellWidth: 50 },
          3: { cellWidth: 152 },
          4: { cellWidth: 78 },
          5: { cellWidth: 50 },
          6: { cellWidth: 50 },
          7: { cellWidth: 50 },
          8: { cellWidth: 50 },
          9: { cellWidth: 50 },
          10: { cellWidth: 70 },
          11: { cellWidth: "auto" },
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
      if (sortBy === "Road Names") {
        uniques = uniqueRsRoadName;
      } else if (sortBy === "AAR Codes") {
        uniques = uniqueRsAarCode;
      } else {
        uniques = uniqueRsStatus;
        console.log("uniques: " + uniques);
      }
      var k = 0;
      var headerY = 0;
      doc.setFontSize(12);
      for (i = 0; i < uniques.length; i++) {
        headerY = 50;
        if (breakType !== "Page"){
        if (i !== 0) {
          headerY = doc.lastAutoTable.finalY + 15;
        }
        if (headerY + 50 > doc.internal.pageSize.height) {
          doc.addPage();
          headerY = 50;
        }}
        doc.text(uniques[i], 50, headerY);
        for (j = 0; j < rsrows.length; j++) {
          if (
            (sortBy === "Road Names" && rsrows[j].roadName === uniques[i]) ||
            (sortBy === "AAR Codes" && rsrows[j].aarCode === uniques[i]) ||
            (sortBy === "Status" && rsrows[j].rsStatus === uniques[i])
          ) {
            somerows[k] = new Rsrow(
              rsrows[j].roadName,
              rsrows[j].roadNumber,
              rsrows[j].color,
              rsrows[j].aarCode,
              rsrows[j].description,
              rsrows[j].capacity,
              rsrows[j].bldr,
              rsrows[j].bltDate,
              rsrows[j].ltWeight,
              rsrows[j].loadLimit,
              rsrows[j].lastMaintDate,
              rsrows[j].rsStatus
            );
            k++;
          }
        }
        autoTable(doc, {
          columns: columns,
          body: somerows,
          startY : headerY + 10,
          styles: { cellPadding: 3, fontSize: 9 },
          columnStyles: {
            0: { cellWidth: 50 },
            1: { cellWidth: 50 },
            2: { cellWidth: 50 },
            3: { cellWidth: 152 },
            4: { cellWidth: 78 },
            5: { cellWidth: 50 },
            6: { cellWidth: 50 },
            7: { cellWidth: 50 },
            8: { cellWidth: 50 },
            9: { cellWidth: 50 },
            10: { cellWidth: 70 },
            11: { cellWidth: "auto" },
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
        if (breakType === "Page" && i < uniques.length - 1) {
          headerY = 0;
          doc.addPage();
        }
        k = 0;
        somerows = [];
      }
    }
    doc.save("rollingstock.pdf");
  },
  printRfids(documents) {
    class Rsrow {
      constructor(roadName, roadNumber, color, aarCode, description, rfid) {
        this.roadName = roadName;
        this.roadNumber = roadNumber;
        this.color = color;
        this.aarCode = aarCode;
        this.description = description;
        this.rfid = rfid;
      }
    }
    var i = 0;
    var rsrows = [];
    for (i = 0; i < documents.length; i++) {
      rsrows[i] = new Rsrow(
        documents[i].roadName,
        documents[i].roadNumber,
        documents[i].color,
        documents[i].aarCode,
        documents[i].description,
        documents[i].rfid
      );
    }
    var columns = [
      { header: "RFID", dataKey: "rfid" },
      { header: "Road", dataKey: "roadName" },
      { header: "Number", dataKey: "roadNumber" },
      { header: "Color", dataKey: "color" },
      { header: "AAR", dataKey: "aarCode" },
      { header: "Description", dataKey: "description" },
    ];
    var doc = new jsPDF("p", "pt");
    doc.text("RFID Report", 220, 30);
    // @ts-ignore
    autoTable(doc, {
      columns: columns,
      body: rsrows,
      styles: { cellPadding: 3, fontSize: 9 },
      columnStyles: {
        0: { cellWidth: 70 },
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
    doc.save("rfid.pdf");
  },
  printStructures(documents) {
    class StructureRow {
      constructor(
        title,
        structureUse,
        description,
        owner,
        location,
        construction,
        builtDate,
        size
      ) {
        this.title = title;
        this.structureUse = structureUse;
        this.description = description;
        this.owner = owner;
        this.location = location;
        this.construction = construction;
        this.builtDate = builtDate;
        this.size = size;
      }
    }
    var i = 0;
    var structureRows = [];
    for (i = 0; i < documents.length; i++) {
      structureRows[i] = new StructureRow(
        documents[i].title,
        documents[i].structureUse,
        documents[i].description,
        documents[i].owner,
        documents[i].location,
        documents[i].construction,
        documents[i].builtDate,
        documents[i].size
      );
    }
    var columns = [
      { header: "Title", dataKey: "title" },
      { header: "Use", dataKey: "structureUse" },
      { header: "Description", dataKey: "description" },
      { header: "Owner", dataKey: "owner" },
      { header: "Location", dataKey: "location" },
      { header: "Construction", dataKey: "construction" },
      { header: "Built", dataKey: "builtDate" },
      { header: "Size", dataKey: "size" },
    ];
    let doc = new jsPDF("l", "pt");
    doc.text("Structure Report", 220, 30);
    // @ts-ignore
    autoTable(doc, {
      columns: columns,
      body: structureRows,
      styles: { cellPadding: 3, fontSize: 10 },
      columnStyles: {
        0: { cellWidth: 60 },
      },
      theme: "striped",
      margin: { top: 50 },
    });
    doc.save("structures.pdf");
  },
  formatDate(unformatDate) {
    if (unformatDate === null || unformatDate === "") {
      return "";
    } else {
      return moment.utc(unformatDate).format("YYYY-MM-DD");
    }
  },
};
