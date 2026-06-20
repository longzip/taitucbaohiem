(function() {
    'use strict';

    // --- CONFIGURATION ---
    const GRAPHQL_API_URL = 'https://app.hotham.vn/graphql';
    const SEARCH_RESULTS_TIMEOUT_MS = 15000;
    const FORM_LOAD_TIMEOUT_MS = 10000;

    const API_FIELD_MAP = {
        'maSoBHXH': 'maSoBhxh',
        'hoTen': 'hoVaTen',
        'ngaySinhDt': 'ngaySinh',
        'soTheBhyt': 'maSoThe',
        'ngay5NamDt': 'thoiDiem5Nam',
        'coSoKCB': 'coSoKCB',
        'tenDvi': 'tenDonVi'
    };

    // --- CORE LOGIC ---

    async function sendDataToApi(payload) {
        console.log('VNPost Auto-Lookup: Sending final payload to API:', payload);
        const mutation = `
            mutation SyncCustomer($input: SyncCustomerInput!) {
                syncCustomer(input: $input) { message status }
            }
        `;
        try {
            const response = await fetch(GRAPHQL_API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify({ query: mutation, variables: { input: payload } })
            });
            const result = await response.json();
            if (result.errors || !response.ok) {
                throw new Error(result.errors ? result.errors.map(e => e.message).join('\n') : `HTTP Error: ${response.status}`);
            }
            const syncResult = result.data.syncCustomer;
            if (syncResult && syncResult.status === 'success') {
                alert(`✅ Data sent successfully!\n\nMessage: ${syncResult.message}`);
                window.close();
            } else {
                throw new Error(syncResult ? syncResult.message : 'Unknown server error.');
            }
        } catch (error) {
            console.error('VNPost Auto-Lookup: API call failed:', error);
            if (confirm(`❌ Failed to send data!\n\nDetails: ${error.message}\n\nDo you want to try again?`)) {
                sendDataToApi(payload);
            } else {
                window.close();
            }
        }
    }

    function scrapeAndSendData() {
        console.log('VNPost Auto-Lookup: Value detected. Scraping all data now...');
        const payload = {};

        for (const [formName, apiName] of Object.entries(API_FIELD_MAP)) {
            const input = document.querySelector(`input[name="${formName}"]`);
            payload[apiName] = input ? input.value.trim() : null;
        }

        const gioiTinhInput = document.querySelector('input[name="gioiTinh"]');
        if (gioiTinhInput) {
            const visibleInput = gioiTinhInput.closest('.dx-field-item-content')?.querySelector('input.dx-texteditor-input');
            payload['gioiTinhHienThi'] = visibleInput ? visibleInput.value.trim() : null;
        }

        const hanTheLabel = Array.from(document.querySelectorAll('span.dx-field-item-label-text')).find(el => el.innerText.trim() === 'Hạn thẻ');
        if (hanTheLabel) {
            const container = hanTheLabel.closest('.dx-field-item');
            const dateInputs = container?.querySelectorAll('dx-date-box input[type="hidden"]');
            if (dateInputs && dateInputs.length >= 2) {
                payload['hanTheTuNgay'] = dateInputs[0].value;
                payload['hanTheDenNgay'] = dateInputs[1].value;
            }
        }

        if (!payload.maSoBhxh) {
            alert('⚠️ VNPost Auto-Lookup: Scrape failed. Could not find Social Insurance Number in results.');
            return;
        }

        sendDataToApi(payload);
    }

    function fillAndSubmitForm(params) {
        const fillInput = (input, value) => {
            if (input && value) {
                input.value = value;
                input.dispatchEvent(new Event('input', { bubbles: true }));
                input.dispatchEvent(new Event('change', { bubbles: true }));
                return true;
            }
            return false;
        };

        fillInput(document.querySelector('input[name="maSoBHXH"]'), params.get('maSoBHXH'));
        fillInput(document.querySelector('input[name="hoTen"]'), params.get('hoTen'));

        const ngaySinhDt = params.get('ngaySinhDt');
        if (ngaySinhDt) {
            const ngaySinhLabel = Array.from(document.querySelectorAll('label .dx-field-item-label-text')).find(l => l.textContent.trim() === 'Ngày sinh');
            const ngaySinhInput = ngaySinhLabel?.closest('.dx-field-item')?.querySelector('.dx-texteditor-input');
            const formattedDate = ngaySinhDt.split('-').reverse().join('/');
            if (fillInput(ngaySinhInput, formattedDate)) {
                ngaySinhInput.blur();
            }
        }

        console.log('VNPost Auto-Lookup: Filled form with lookup data.');

        setTimeout(() => {
            const searchButton = Array.from(document.querySelectorAll('dx-button')).find(btn => btn.textContent.trim() === 'Tra cứu' && btn.querySelector('i.dx-icon-search'));
            if (searchButton) {
                searchButton.click();
                console.log("VNPost Auto-Lookup: Clicked 'Tra cứu' button. Waiting for result data to be populated...");
                waitForValue(
                    'input[name="soTheBhyt"]', 
                    scrapeAndSendData, 
                    SEARCH_RESULTS_TIMEOUT_MS
                );
            } else {
                alert("⚠️ VNPost Auto-Lookup: Could not find the 'Tra cứu' button.");
            }
        }, 500);
    }
    
    /**
     * Waits for an element to exist in the DOM.
     */
    function waitForElement(selector, callback, timeoutMs) {
        const startTime = Date.now();
        const interval = setInterval(() => {
            const el = document.querySelector(selector);
            if (el) {
                clearInterval(interval);
                callback();
            } else if (Date.now() - startTime > timeoutMs) {
                clearInterval(interval);
                alert(`⚠️ VNPost Auto-Lookup: Timed out waiting for the lookup form to load.`);
            }
        }, 500);
    }

    /**
     * Waits for an element to have a non-empty value.
     */
    function waitForValue(selector, callback, timeoutMs) {
        const startTime = Date.now();
        const interval = setInterval(() => {
            const el = document.querySelector(selector);
            if (el && el.value) {
                clearInterval(interval);
                callback();
            } else if (Date.now() - startTime > timeoutMs) {
                clearInterval(interval);
                alert(`⚠️ VNPost Auto-Lookup: Timed out waiting for search results to be populated.`);
            }
        }, 500);
    }

    /**
     * Main entry point for the automation.
     */
    function run() {
        const params = new URLSearchParams(window.location.search);
        if (params.has('maSoBHXH') || params.has('hoTen')) {
            console.log("VNPost Auto-Lookup: Detected target page. Waiting for form to load...");
            waitForElement(
                'input[name="maSoBHXH"]', 
                () => fillAndSubmitForm(params), 
                FORM_LOAD_TIMEOUT_MS
            );
        }
    }

    run();

})();