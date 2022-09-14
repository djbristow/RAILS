<template>
  <div class="xx">
    <h1>About RAILS RS RFID Manager</h1>
    <p>
      The Railway Administration and Information Logical System (RAILS) RFID
      Application is one of several applications in the RAILS family of
      applications. It is a MongoDB, Express, Vue, and Node (MEVN) application
      that provides a user with a web application to show, when an RFID tag is
      read, the road name and number of the rolling stock associated with that
      tag. If there is no association with a peice of rolling stock input fields
      are provided to allow the user to enter the road name and number.
    </p>
    <img src="rsrm6.png" />
    <p>Several components are required:</p>
    <div class="indent">
      <ul>
        <li>
          <strong>RFID Controller</strong> a micro controller device that
          processes RFID tags obtained from a RFID reader and then publishes IoT
          messages to the MQTT Broker.
        </li>
        <li>
          <strong>MQTT Broker</strong> is the heart of any publish/subscribe
          protocol, is responsible for receiving messages, filtering them,
          posting to designated topics and sending messages to clients
          subscribing to topics. The subscribers and publishers bridge the MQTT
          elements with the GUI applications. The broker handles IoT messages.
        </li>
        <li>
          <strong>IoT Subscriber RFID Services</strong> (ISRS) subscribes to
          RFID messages and pushes them via a web-socket to the RSRM component.
        </li>
        <li>
          <strong>IoT Subscriber Micro Services</strong> (ISMS) that subscribes
          to micro controller startup and heartbeat messages, updating the
          micros collection via RLDS.
        </li>
        <li>
          <strong>Railroad Layout Data Services</strong> (RLDS) provides REST
          access to model railroad layout collections including micros
        </li>
        <li>
          <strong>Railroad Inventory Data Services</strong> (RIDS) provides REST
          access to railroad inventory collections including rollingstock.
        </li>
        <li>
          <strong>MongoDB</strong> a NoSQL database program that stores data
          records as documents which are gathered together in collections. A
          database stores one or more collections of documents.
        </li>
        <li>
          <strong>MR Data</strong> is the document repository, used by MongoDB,
          to store complete collections of items such as rollingstock,
          industries (producers and consumers), track elements, turnouts,
          projects, purchases, etc. in support of RAILS.
        </li>
        <li>
          <strong>Rolling Stock RFID Manager</strong> (RSRM) is the application
          that allows a user to match a RFID tag to a rollingstock's road name
          and number.
        </li>
      </ul>
    </div>
    <p>The user guide is available at:</p>
    <p>Waiting for Vuetify 3.2 to format and paginate tables</p>
  </div>
</template>

<script>
export default {
  name: "About",
};
</script>

<style  scoped>
.indent {
  margin-left: 50px;
}
