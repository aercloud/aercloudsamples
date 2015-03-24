#
# Replease <your-api-key> with the real key before running this program
#
import json,http.client
connection = http.client.HTTPConnection('api.aercloud.aeris.com', 80)
connection.request('POST', '/v1/1/scls/MyFirstDevice/containers/MyFirstContainer/contentInstances?apiKey=<your-api-key>', json.dumps({
	"Accuracy": "10",
	"Latitude": "37.61",
	"LocationTimeStamp": "1366361979315",
	"Longitude": "-122.385979"
	}), {
		"Content-Type": "application/json; charset=\"UTF-8\""
	})
r1 = connection.getresponse()
print(r1.status, r1.reason)
