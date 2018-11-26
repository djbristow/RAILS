/*
This application creates an MQTT message to simulate the reading of an RFID tag
The application requires three input paramaters: the sensor, the RFID tag and the
IP of the MQTT Broker
The output sent to the MQTT broker looks like:
{"epochTime":"1542782170","sensor":"rfidRdr01","rfid":"0000000730"}

Copyright 2018 David J Bristow

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
 */

package org.rails.kjcrr;

import org.eclipse.paho.client.mqttv3.*;

public class PubSync {

	public static void main(String[] args) {
		String clientId = "dbristow" ;
		//{"epochTime":"1542782170","sensor":"rfidRdr01","rfid":"0000000730"}
		long epoch = System.currentTimeMillis()/1000;
		String msg = "{\"epochTime\":\"" + epoch + "\",\"sensor\":\"" + args[0] + "\",\"rfid\":\"" + args[1] + "\"}";
		try {
			MqttClient client = new MqttClient("tcp://"+args[2]+":1883" , clientId);
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
