import { useCarbonFootprint } from 'react-carbon-footprint';

function CarbonFootprintDisplay() {
  const [gCO2, bytesTransferred] = useCarbonFootprint();

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 10,
        right: 10,
        background: 'rgba(255,255,255,0.9)',
        padding: '10px',
        borderRadius: '5px',
        border: '1px solid #ddd',
        fontSize: '13px',
        zIndex: 1000,
      }}
    >
      <strong>Carbon Footprint</strong>
      <p style={{ margin: '4px 0' }}>Data: {(bytesTransferred / 1024).toFixed(1)} KB</p>
      <p style={{ margin: '4px 0' }}>CO2: {gCO2.toFixed(4)} grams</p>
    </div>
  );
}

export default CarbonFootprintDisplay;