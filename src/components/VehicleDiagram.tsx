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
  // Adjusted, larger car layout (viewBox 0 0 220 110)
  const VehicleParts = [
    {name: 'Front Bumper', x: 90, y: 4, width: 40, height: 10},
    {name: 'Hood', x: 90, y: 14, width: 40, height: 18},
    {name: 'Windshield', x: 90, y: 32, width: 40, height: 9},
    {name: 'Roof', x: 90, y: 41, width: 40, height: 22},
    {name: 'Front Left Door', x: 45, y: 41, width: 45, height: 12},
    {name: 'Rear Left Door', x: 45, y: 53, width: 45, height: 10},
    {name: 'Front Right Door', x: 130, y: 41, width: 45, height: 12},
    {name: 'Rear Right Door', x: 130, y: 53, width: 45, height: 10},
    {name: 'Front Left Fender', x: 45, y: 14, width: 45, height: 18},
    {name: 'Front Right Fender', x: 130, y: 14, width: 45, height: 18},
    {name: 'Rear Left Fender', x: 45, y: 63, width: 45, height: 18},
    {name: 'Rear Right Fender', x: 130, y: 63, width: 45, height: 18},
    {name: 'Trunk', x: 90, y: 81, width: 40, height: 18},
    {name: 'Rear Bumper', x: 90, y: 99, width: 40, height: 9},
    {name: 'Left Front Tire', x: 25, y: 22, width: 18, height: 18, isTire: true},
    {name: 'Right Front Tire', x: 177, y: 22, width: 18, height: 18, isTire: true},
    {name: 'Left Rear Tire', x: 25, y: 72, width: 18, height: 18, isTire: true},
    {name: 'Right Rear Tire', x: 177, y: 72, width: 18, height: 18, isTire: true},
  ];
  const hasDamage = (partName: string) => damageNotes.some(note => note.part === partName);

  // Assign numbers to all parts
  const partNumbers: Record<string, number> = {};
  const legend: string[] = [];
  VehicleParts.forEach((part, idx) => {
    partNumbers[part.name] = idx + 1;
    legend.push(`${idx + 1}. ${part.name}`);
  });

  // SVG viewBox: width=220, height=110
  // Faint car silhouette (simple outline, larger)
  const carSilhouette = `
    <rect x='40' y='8' width='140' height='94' rx='36' fill='none' stroke='#bbb' stroke-width='2' opacity='0.3'/>
    <ellipse cx='110' cy='55' rx='72' ry='44' fill='none' stroke='#bbb' stroke-width='1.5' opacity='0.2'/>
  `;

  const svgParts = VehicleParts.map((part, idx) => {
    const number = idx + 1;
    const fontSize = part.isTire ? 11 : 12;
    const fontWeight = 'bold';
    const textY = part.y + part.height / 2 + 4;
    const isTire = part.isTire;
    const damaged = hasDamage(part.name);
    if (isTire) {
      return `
        <circle cx='${part.x + part.width / 2}' cy='${part.y + part.height / 2}' r='${part.width / 2}' fill='white' stroke='#444' stroke-width='1.2'/>
        <text x='${part.x + part.width / 2}' y='${part.y + part.height / 2 + 4}' font-size='${fontSize}' font-weight='${fontWeight}' text-anchor='middle' fill='black'>${number}${damaged ? '★' : ''}</text>
      `;
    }
    return `
      <rect x='${part.x}' y='${part.y}' width='${part.width}' height='${part.height}' rx='7' fill='white' stroke='#444' stroke-width='1.2'/>
      <text x='${part.x + part.width / 2}' y='${textY}' font-size='${fontSize}' font-weight='${fontWeight}' text-anchor='middle' fill='black'>${number}${damaged ? '★' : ''}</text>
    `;
  }).join('');

  // Add a bold, modern title
  const diagramTitle = `<text x='110' y='-7' font-size='15' font-weight='bold' text-anchor='middle' fill='black'>VEHICLE DIAGRAM</text>`;

  // Two-column legend, smaller text
  const legendRows = Math.ceil(legend.length / 2);
  const legendLeft = legend.slice(0, legendRows);
  const legendRight = legend.slice(legendRows);
  const legendHtml = `
    <div style='font-size:10px; margin-top:8px; text-align:left; display:flex; gap:32px; justify-content:center;'>
      <div>${legendLeft.join('<br/>')}</div>
      <div>${legendRight.join('<br/>')}</div>
    </div>
    <div style='font-size:10px; margin-top:2px; text-align:center;'>★ = Damaged</div>
  `;

  return `
    <div style='text-align:center; margin-bottom:3px;'><span style='font-size:16px; font-weight:bold;'>Vehicle Diagram</span></div>
    <svg width='100%' height='200' viewBox='-10 -15 240 130' xmlns='http://www.w3.org/2000/svg'>
      ${carSilhouette}
      ${svgParts}
    </svg>
    ${legendHtml}
  `;
}
