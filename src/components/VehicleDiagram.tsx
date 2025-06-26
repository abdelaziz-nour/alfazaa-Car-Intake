import {View, TouchableOpacity, Text, StyleSheet, useWindowDimensions} from 'react-native';

interface VehicleDiagramProps {
  vehicleType: string;
  onPartPress: (partName: string) => void;
  damageNotes: Array<{
    part: string;
    damage: string;
    timestamp?: string;
  }>;
}

interface VehiclePart {
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export default function VehicleDiagram({
  vehicleType,
  onPartPress,
  damageNotes,
}: VehicleDiagramProps) {
  // Use a fixed aspect ratio for the vehicle diagram
  const aspectRatio = 0.75; // width:height ratio (e.g., 300:400)

  // All positions and sizes are now in percentages (relative to 100% width/height)
  const VehicleParts = [
    // name, left %, top %, width %, height %
    {name: 'Front Bumper', x: 36.7, y: 10, width: 26.6, height: 6.25},
    {name: 'Hood', x: 36.7, y: 16.25, width: 26.6, height: 17.5},
    {name: 'Windshield', x: 36.7, y: 33.75, width: 26.6, height: 10},
    {name: 'Roof', x: 36.7, y: 43.75, width: 26.6, height: 22.5},
    {name: 'Front Left Door', x: 13.3, y: 43.75, width: 23.4, height: 11.25},
    {name: 'Rear Left Door', x: 13.3, y: 55, width: 23.4, height: 11.25},
    {name: 'Front Right Door', x: 63.3, y: 43.75, width: 23.4, height: 11.25},
    {name: 'Rear Right Door', x: 63.3, y: 55, width: 23.4, height: 11.25},
    {name: 'Front Left Fender', x: 13.3, y: 26.25, width: 23.4, height: 17.5},
    {name: 'Front Right Fender', x: 63.3, y: 26.25, width: 23.4, height: 17.5},
    {name: 'Rear Left Fender', x: 13.3, y: 66.25, width: 23.4, height: 17.5},
    {name: 'Rear Right Fender', x: 63.3, y: 66.25, width: 23.4, height: 17.5},
    {name: 'Trunk', x: 36.7, y: 66.25, width: 26.6, height: 17.5},
    {name: 'Rear Bumper', x: 36.7, y: 83.75, width: 26.6, height: 6.25},
    {name: 'Left Front Tire', x: 0, y: 31.25, width: 13.3, height: 10},
    {name: 'Right Front Tire', x: 86.7, y: 31.25, width: 13.3, height: 10},
    {name: 'Left Rear Tire', x: 0, y: 71.25, width: 13.3, height: 10},
    {name: 'Right Rear Tire', x: 86.7, y: 71.25, width: 13.3, height: 10},
  ];

  const hasDamage = (partName: string): boolean => {
    return damageNotes.some(note => note.part === partName);
  };

  const getPartStyle = (partName: string) => ({
    ...styles.vehiclePart,
    backgroundColor: hasDamage(partName) ? '#f44336' : '#e3f2fd',
  });

  return (
    <View style={styles.diagramContainer}>
      <Text style={styles.diagramTitle}>Vehicle Top View</Text>
      <View style={styles.aspectRatioBox}>
        <View style={styles.vehicleContainer}>
          {VehicleParts.map(part => (
            <TouchableOpacity
              key={part.name}
              style={[
                getPartStyle(part.name),
                {
                  position: 'absolute',
                  left: `${part.x}%`,
                  top: `${part.y}%`,
                  width: `${part.width}%`,
                  height: `${part.height}%`,
                },
              ]}
              onPress={() => onPartPress(part.name)}>
              <Text style={styles.partText}>{part.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  diagramContainer: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    elevation: 3,
    marginVertical: 10,
  },
  diagramTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  aspectRatioBox: {
    width: '100%',
    aspectRatio: 0.75, // 300:400
    position: 'relative',
  },
  vehicleContainer: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#dee2e6',
    overflow: 'hidden',
  },
  vehiclePart: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 1,
    padding: 0,
  },
  partText: {
    fontSize: 10,
    fontWeight: '500',
    textAlign: 'center',
    color: '#333',
  },
});

// Utility to generate SVG for receipts
export function generateVehicleDiagramSVG(damageNotes: Array<{ part: string; damage: string }>): string {
  // Use the same part layout as above, but in SVG coordinates (viewBox 0 0 100 133.33 for 0.75 aspect ratio)
  const VehicleParts = [
    {name: 'Front Bumper', x: 36.7, y: 10, width: 26.6, height: 6.25},
    {name: 'Hood', x: 36.7, y: 16.25, width: 26.6, height: 17.5},
    {name: 'Windshield', x: 36.7, y: 33.75, width: 26.6, height: 10},
    {name: 'Roof', x: 36.7, y: 43.75, width: 26.6, height: 22.5},
    {name: 'Front Left Door', x: 13.3, y: 43.75, width: 23.4, height: 11.25},
    {name: 'Rear Left Door', x: 13.3, y: 55, width: 23.4, height: 11.25},
    {name: 'Front Right Door', x: 63.3, y: 43.75, width: 23.4, height: 11.25},
    {name: 'Rear Right Door', x: 63.3, y: 55, width: 23.4, height: 11.25},
    {name: 'Front Left Fender', x: 13.3, y: 26.25, width: 23.4, height: 17.5},
    {name: 'Front Right Fender', x: 63.3, y: 26.25, width: 23.4, height: 17.5},
    {name: 'Rear Left Fender', x: 13.3, y: 66.25, width: 23.4, height: 17.5},
    {name: 'Rear Right Fender', x: 63.3, y: 66.25, width: 23.4, height: 17.5},
    {name: 'Trunk', x: 36.7, y: 66.25, width: 26.6, height: 17.5},
    {name: 'Rear Bumper', x: 36.7, y: 83.75, width: 26.6, height: 6.25},
    {name: 'Left Front Tire', x: 0, y: 31.25, width: 13.3, height: 10},
    {name: 'Right Front Tire', x: 86.7, y: 31.25, width: 13.3, height: 10},
    {name: 'Left Rear Tire', x: 0, y: 71.25, width: 13.3, height: 10},
    {name: 'Right Rear Tire', x: 86.7, y: 71.25, width: 13.3, height: 10},
  ];
  const hasDamage = (partName: string) => damageNotes.some(note => note.part === partName);
  // SVG viewBox: width=100, height=133.33 (aspect 0.75)
  const svgParts = VehicleParts.map(part => `
    <rect x='${part.x}' y='${part.y}' width='${part.width}' height='${part.height}' rx='2' fill='${hasDamage(part.name) ? '#f44336' : '#e3f2fd'}' stroke='#2196F3' stroke-width='0.7'/>
    <text x='${part.x + part.width / 2}' y='${part.y + part.height / 2 + 2}' font-size='4' text-anchor='middle' fill='#333'>${part.name.replace(/ /g, '\u00A0')}</text>
  `).join('');
  return `
    <svg width='200' height='266' viewBox='0 0 100 133.33' xmlns='http://www.w3.org/2000/svg'>
      <rect x='0' y='0' width='100' height='133.33' rx='8' fill='#f8f9fa' stroke='#dee2e6' stroke-width='1.5'/>
      ${svgParts}
    </svg>
  `;
}
