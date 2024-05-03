import React, { useEffect, useState } from 'react';
import '../css/Dashboard.css';
import lays from '/assets/temporary/lays.png';
import tata from '/assets/temporary/tata.png'; // Changed the import name here
import 'ionicons/dist/css/ionicons.min.css';

const Dashboard = () => {

  return (
      <div className='main-content'>
        

        {/* 1st CardBox */}
        <div className='cardBox'>
        {/* Sales */}
          <div className='card'>
            <div>
                <div className='salesNumber'>₱832</div>
                <div className='name'>Sales</div>
            </div>
            <div className='icon'>
              <ion-icon name="cash-outline"></ion-icon>
            </div>
          </div>

          {/* Quantity in Hand */}
          <div className='card'>
            <div>
                <div className='salesNumber'>310</div>
                <div className='name'>Quantity in Hand</div>
            </div>
            <div className='icon'>
            <ion-icon name="cube-outline"></ion-icon>
            </div>
          </div>

          {/* Purchase */}
          <div className='card'>
            <div>
                <div className='salesNumber'>82</div>
                <div className='name'>Purchase</div>
            </div>
            <div className='icon'>
            <ion-icon name="bag-check-outline"></ion-icon>
            </div>
          </div>

          {/* Number of Suppliers */}
          <div className='card'>
            <div>
                <div className='salesNumber'>31</div>
                <div className='name'>Number of Suppliers</div>
            </div>
            <div className='icon'>
            <ion-icon name="people-outline"></ion-icon>
            </div>
          </div>

        </div>

         {/* Top Selling Stock */}
        <div className='details'>
            <div className='topSelling'>
              <div className='cardHeader'>
                <h2>Top Selling Stock</h2>
                <a href='#' className='btn'>See All</a> {/* Changed class to className */}
              </div>

              <table>
                  <thead>
                      <tr>
                        <td>Name</td>
                        <td>Sold Quantity</td>
                        <td>Remaining Quantity</td>
                        <td>Price</td>
                      </tr>
                  </thead>

                  <tbody>
                    <tr>
                        <td>Surf Excel</td>
                        <td>30</td>
                        <td>12</td>
                        <td>₱100</td>
                    </tr>

                    <tr>
                        <td>Rin</td>
                        <td>21</td>
                        <td>15</td>
                        <td>₱207</td>
                    </tr>

                    <tr>
                        <td>Parle G</td>
                        <td>19</td>
                        <td>17</td>
                        <td>₱105</td>
                    </tr>
                  </tbody>
              </table>
            </div>

            <div className='lowStock'>
                <div className='cardHeader'>
                  <h2>Low Quantity Stock</h2>
                  <a href='#' className='btn'>See All</a> {/* Changed class to className */}
                </div>

                <table>
                    <tr>
                        <td width="60px">
                          <div className='imgBx'><img src={lays} alt="lays" className="tata" /></div>
                        </td>
                        <td>
                          <h4>Lays <br></br> <span>Remaining Quantity: 12</span> </h4>
                        </td>
                        <td><span className='low'>Low</span></td>
                    </tr>

                    <tr>
                    <td width="60px">
                          <div className='imgBx'><img src={tata} alt="Tata" className="tata" /></div>
                        </td>
                        <td>
                          <h4>Tata Salt <br></br> <span>Remaining Quantity: 12</span></h4>
                        </td>
                        <td><span className='low'>Low</span></td>
                    </tr>
              </table>
            </div>
        </div>
      </div>
      
  );
}

export default Dashboard;
