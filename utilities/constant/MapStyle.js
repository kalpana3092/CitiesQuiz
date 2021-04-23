/**
* customMapStyle to show Only Country-borders 
*/
export const MapStyle = [
    {
      featureType: "administrative",
      elementType: "labels",
      stylers: [
      {
          visibility: "off"
      }
      ]
    },
    {
      featureType: "poi",
      elementType: "labels",
      stylers: [
        {
          visibility: "off"
        }
      ]
    },
    {
      featureType: "road",
      elementType: "labels",
      stylers: [
        {
          visibility: "off"
        }
      ]
    },
    {
      featureType: "transit",
      elementType: "labels",
      stylers: [
        {
          visibility: "off"
        }
      ]
    },
    {
        featureType: "water",
        elementType: "labels",
        stylers: [
          {
            visibility: "off"
          }
        ]
      },
    
  ];