#!/bin/sh

set -e

curl --request GET \
  --url "http://mapserver.bdl.lasy.gov.pl/ArcGIS/rest/services/Mapa_turystyczna/MapServer/77/query?where=objectId%3E0&f=geojson&resultOffset=$1" \
  -o data/bushcraft_$1.json \
  --header 'accept: text/html' \
  --header 'accept-language: pl-pl' \
  --header 'connection: keep-alive' \
  --header 'host: mapserver.bdl.lasy.gov.pl' \
  --header 'referer: https://www.bdl.lasy.gov.pl/portal/mapy' \
  --header 'user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.4 Safari/605.1.15' \
  --compressed \
  -v

# curl --request GET \
#   --url 'http://mapserver.bdl.lasy.gov.pl/ArcGIS/rest/services/Mapa_turystyczna/MapServer/51/query?where=objectId%3E0&f=kmz' \
#   -o data/bushcraft.kmz \
#   --header 'accept: text/html' \
#   --header 'accept-language: pl-pl' \
#   --header 'connection: keep-alive' \
#   --header 'host: mapserver.bdl.lasy.gov.pl' \
#   --header 'referer: https://www.bdl.lasy.gov.pl/portal/mapy' \
#   --header 'user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.4 Safari/605.1.15' \
#   --compressed
#
# node_modules/.bin/togpx data/bushcraft.json > data/bushcraft.gpx
#
