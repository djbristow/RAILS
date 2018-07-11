package org.rails.kjcrr;

import org.eclipse.paho.client.mqttv3.*;

public class PubSync {

	public static void main(String[] args) {
		String clientId = "dbristow" ;
		//{"mac":"4c:eb:42:bd:69:51","sensor":"rfid01","rfid":"a12345677a"}

		String msg = "{\"mac\":\"" + args[0] + "\",\"sensor\":\"" + args[1] + "\",\"rfid\":\"" + args[2] + "\"}";
		try {
			MqttClient client = new MqttClient("tcp://"+args[3]+":1883" , clientId);
			MqttTopic topic = client.getTopic("sensors/rfid");
			System.out.println(msg);
			MqttMessage message = new MqttMessage(msg.getBytes());
			message.setQos(1);
			client.connect();
			MqttDeliveryToken token = topic.publish(message);
			token.waitForCompletion(10000);
			client.disconnect();
		} catch (Exception e) {
			e.printStackTrace();
		}

	}

}
