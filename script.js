// --- FAKE DATA (AbhiBus Style) ---
const BUS_DB = [
    { id: 1, operator: "Orange Tours & Travels", type: "Volvo Multi-Axle A/C Sleeper", dep: "21:00", arr: "06:00", dur: "09h 00m", price: 1200, rating: 4.5, seats: 12, ac: true, sleeper: true },
    { id: 2, operator: "Jabbar Travels", type: "Scania AC Multi Axle Seater", dep: "21:30", arr: "05:30", dur: "08h 00m", price: 950, rating: 4.2, seats: 8, ac: true, sleeper: false },
    { id: 3, operator: "VRL Travels", type: "Non-AC Sleeper (2+1)", dep: "19:00", arr: "05:00", dur: "10h 00m", price: 800, rating: 3.9, seats: 20, ac: false, sleeper: true },
    { id: 4, operator: "KSRTC (Airavat)", type: "Volvo Club Class", dep: "22:15", arr: "06:15", dur: "08h 00m", price: 1100, rating: 4.7, seats: 5, ac: true, sleeper: false },
    { id: 5, operator: "Morning Star", type: "AC Sleeper / Seater", dep: "23:00", arr: "07:30", dur: "08h 30m", price: 1050, rating: 4.1, seats: 15, ac: true, sleeper: true },
];

const app = {
    selectedSeats: [],
    currentBus: null,
    
    // UI References
    loader: document.getElementById('global-loader'),
    views: {
        hero: document.getElementById('hero-view'),
        results: document.getElementById('results-view'),
        success: document.getElementById('success-view')
    },
    
    // --- MAGIC TRICK: FAKE LOADER ---
    loading: (text, duration = 2000, callback) => {
        app.loader.classList.remove('hidden');
        document.getElementById('loader-text').innerText = text;
        const bar = document.querySelector('.progress');
        bar.style.width = '0%';
        
        setTimeout(() => bar.style.width = '50%', duration / 2);
        setTimeout(() => bar.style.width = '100%', duration - 200);
        
        setTimeout(() => {
            app.loader.classList.add('hidden');
            if(callback) callback();
        }, duration);
    },

    // --- NAVIGATION ---
    init: () => {
        document.getElementById('search-form').addEventListener('submit', (e) => {
            e.preventDefault();
            app.loading("Searching Best Routes...", 2500, () => {
                app.switchView('results');
                app.renderBuses(BUS_DB);
            });
        });

        document.querySelector('.close-modal').addEventListener('click', () => {
            document.getElementById('seat-modal').classList.remove('active');
        });

        document.getElementById('pay-btn').addEventListener('click', app.processPayment);
    },

    switchView: (viewName) => {
        Object.values(app.views).forEach(el => el.classList.add('hidden'));
        app.views[viewName].classList.remove('hidden');
        // If results view, update count
        if(viewName === 'results') {
            document.getElementById('bus-count').innerText = BUS_DB.length;
        }
    },

    goBack: () => app.switchView('hero'),

    // --- BUS LIST LOGIC ---
    renderBuses: (data) => {
        const container = document.getElementById('bus-list-container');
        container.innerHTML = '';
        
        data.forEach(bus => {
            const html = `
                <div class="bus-card fade-up">
                    <div class="operator-info">
                        <h3>${bus.operator}</h3>
                        <span class="bus-type">${bus.type}</span>
                        <div class="rating-badge"><i class="fa-solid fa-star"></i> ${bus.rating}</div>
                    </div>
                    <div class="timing">
                        <div class="time-big">${bus.dep}</div>
                        <span class="duration">${bus.dur}</span>
                        <div class="time-big" style="color:#aaa">${bus.arr}</div>
                    </div>
                    <div class="price-section">
                        <span class="price-tag">₹${bus.price}</span>
                        <span class="seats-left">${bus.seats} Seats Left</span>
                        <button class="select-seat-btn" onclick="app.openSeatMap(${bus.id})">Select Seat</button>
                    </div>
                </div>
            `;
            container.innerHTML += html;
        });
        document.getElementById('bus-count').innerText = data.length;
    },

    filterBuses: (criteria) => {
        // Simple client-side filtering to mimic backend
        // In a real app, this would be more complex, here we just filter the original DB
        // For visual effect, let's just reshuffle or filter lightly
        const inputs = document.querySelectorAll('.sidebar input[type="checkbox"]');
        // Just re-render for now to show interaction
        app.renderBuses(BUS_DB); // In a real scenario, filter BUS_DB based on inputs
    },

    // --- SEAT MAP LOGIC ---
    openSeatMap: (busId) => {
        app.currentBus = BUS_DB.find(b => b.id === busId);
        app.selectedSeats = [];
        app.updateSeatUI();
        
        const grid = document.getElementById('seats-grid');
        grid.innerHTML = '';
        
        // Generate 30 seats (AbhiBus 2+1 layout logic)
        for(let i=1; i<=30; i++) {
            const seat = document.createElement('div');
            // Random booked status
            const status = Math.random() < 0.4 ? (Math.random() < 0.2 ? 'ladies' : 'booked') : 'available';
            
            seat.className = `seat ${status}`;
            if(status === 'available') {
                seat.onclick = () => app.toggleSeat(i, seat);
            }
            grid.appendChild(seat);
        }
        
        document.getElementById('seat-modal').classList.add('active');
    },

    toggleSeat: (num, el) => {
        if(app.selectedSeats.includes(num)) {
            app.selectedSeats = app.selectedSeats.filter(s => s !== num);
            el.classList.remove('selected');
        } else {
            app.selectedSeats.push(num);
            el.classList.add('selected');
        }
        app.updateSeatUI();
    },

    updateSeatUI: () => {
        const total = app.selectedSeats.length * app.currentBus.price;
        document.getElementById('total-price').innerText = `₹${total}`;
        document.getElementById('selected-seat-nums').innerText = app.selectedSeats.length > 0 
            ? `Seats: ${app.selectedSeats.join(', ')}` 
            : 'No seats selected';
        
        const payBtn = document.getElementById('pay-btn');
        payBtn.disabled = app.selectedSeats.length === 0;
        payBtn.innerText = app.selectedSeats.length > 0 ? `Pay ₹${total}` : 'Proceed to Pay';
    },

    processPayment: () => {
        document.getElementById('seat-modal').classList.remove('active');
        app.loading("Processing Secure Payment...", 3000, () => {
            app.switchView('success');
            document.getElementById('ticket-id').innerText = 'AB-' + Math.floor(Math.random()*1000000);
        });
    }
};

// Start
app.init();