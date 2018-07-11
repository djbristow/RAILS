/*
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
		String clientId = null;
		//{"mac":"4ceb42bd6951","sensor":"rfid01","rfid":"a12345677a"}

		String msg = "{\"mac\":\"" + args[0] + "\",\"sensor\":\"" + args[1] + "\",\"rfid\":\"" + args[2] + "\"}";
		try {
			clientId = args[0];
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
