import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { useState } from 'react';
import { useEffect } from 'react';
export default function Acceuil(props) {
 return (
    <div style={{display:'flex',marginTop:'50px'}}>
    <div style={{width:'50%'}}>
    <ul style={{ marginLeft:'40%',marginTop:'10%'}}>
      <li style={{margin:'10px'}}>Quantité Total de Materiel  : {props.SommeM[3]} </li>
      <li style={{margin:'10px'}}>Bon : {props.SommeM[0]}</li>
      <li style={{margin:'10px'}}>Mauvais : {props.SommeM[1]}</li>
      <li style={{margin:'10px'}}>Abimé : {props.SommeM[2]}</li>
    </ul> 
    </div>
    <div style={{marginLeft:'5%'}} >
        <BarChart
        series={[
          { data: [props.SommeM[0],props.SommeM[1],props.SommeM[2]] }
        ]}
        height={290}
        width={300}
        xAxis={[{ data: ['Bon', 'Mauvais', 'Abimé'], scaleType: 'band' }]}
        margin={{ top: 10, bottom: 30, left: 40, right: 10 }}
    />
    </div>
    </div>

  );
}