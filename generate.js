
// define variable global
const deviceSelect = document.getElementById('deviceSelect');
const resultContainer = document.querySelector('.result-container');
const paketBW = document.querySelector('.paket-bandwith');
const oltGroup = document.querySelector('.olt-group');
let oltData = [];
    

// fungsi menentukan device
deviceSelect.addEventListener('change', () => {
    const deviceType = deviceSelect.value;
    resultContainer.innerHTML = ''; // Clear previous inputs
    if (deviceType == 'zte-c300' | deviceType == 'zte-c600' | deviceType == 'huawei-hifi') {
        oltGroup.style.display = "block";
        paketBW.innerHTML ='';
        resultContainer.innerHTML = `
        <div class="form-result">
            <textarea id="configOutput" readonly></textarea>
            <button onclick="copy()">
                <span id="copy-btn">copy</span>
            </button>
        </div>
        `;
    }else if (deviceType == 'huawei-viberlink' | deviceType == 'zte-c300-relabs' | deviceType == 'huawei-relabs') {
        oltGroup.style.display = "none";
        paketBW.innerHTML = `
        <div class="form-group">
        <label for="username-ppoe">USERNAME PPOE</label>
        <input type="text" id="username-ppoe" placeholder="Masukkan USERNAME PPOE" autocomplete="off">
        </div>
        <div class="form-group">
        <label for="password-ppoe">PASSWORD PPOE</label>
        <input type="text" id="password-ppoe" placeholder="Masukkan PASSWORD PPOE" autocomplete="off">
        </div>
        `;
        resultContainer.innerHTML = `
        <div class="form-result">
            <textarea id="configOutput" readonly></textarea>
            <button onclick="copy()">
                <span id="copy-btn">copy</span>
            </button>
        </div>
        `;
    } 
    else if (deviceType === 'nokia-hifi' | deviceType === 'nokia-viberlink') {
        oltGroup.style.display = "block";
        paketBW.innerHTML = `
        <div class="form-group">
        <label for="paket-pelanggan">Pilih Paket Bandwith</label>
        <select id="paket-pelanggan">
            <option value=""></option>
            <option value="15">15 M</option>
            <option value="30">30 M</option>
            <option value="50">50 M</option>
            <option value="100">100 M</option>
            <option value="500">500 M</option>
        </select>
        </div>
        `;
        resultContainer.innerHTML = `
            <label>Konfigurasi ONT</label>
            <div class="form-result">
            <textarea id="configONT" readonly></textarea>
            <button onclick="copy()">
                <span id="copy-btn">copy</span>
            </button>
            </div>
            <label>Konfigurasi TR</label>
            <div class="form-result">
            <textarea id="configTR" readonly></textarea>
            <button onclick="copyTR()">
                <span id="copy-btn">copy</span>
            </button>
            </div>
            <label>Konfigurasi HSI</label>
            <div class="form-result">
            <textarea id="configHSI" readonly></textarea>
            <button onclick="copyHSI()">
                <span id="copy-btn">copy</span>
            </button>
            </div>
        `;
    }
    else if (deviceType === 'zte-c300-orbit' | deviceType === 'huawei-orbit') {
        oltGroup.style.display = "none";
        paketBW.innerHTML = `
        <div class="form-group">
        <label for="paket-pelanggan">Pilih Paket Bandwith</label>
        <select id="paket-pelanggan">
            <option value=""></option>
            <option value="407">100 M</option>
            <option value="423">300 M</option>
            <option value="409">500 M</option>
        </select>
        </div>
        `;
        resultContainer.innerHTML = `
            <div class="form-result">
            <textarea id="configOutput" readonly></textarea>
            <button onclick="copy()">
                <span id="copy-btn">copy</span>
            </button>
        </div>
        `;
    } 
});



// Function to fetch the OLT data from the JSON file and populate the dropdown
function fetchOltData() {
    deviceSelect.addEventListener('change', () => {
        if(deviceSelect.value == 'zte-c300' | deviceSelect.value == 'zte-c600' | deviceSelect.value == 'zte-c300-relabs' | deviceSelect.value == 'huawei-hifi' | deviceSelect.value == 'huawei-relabs' | deviceSelect.value == 'huawei-viberlink'){
            fetch("../data/olt-orbit.json")
            .then((response) => response.json())
            .then((data) => {
              oltData = data; // Store the data in a global variable
              populateOltSelect(data);
              setupSearchFunctionality(data);
            })
            .catch((error) => console.error("Error fetching OLT data:", error));
        }
        else if(deviceSelect.value === 'nokia-hifi' | deviceSelect.value === 'nokia-viberlink'){
            fetch("../data/olt-hifi.json")
            .then((response) => response.json())
            .then((data) => {
              oltData = data; // Store the data in a global variable
              populateOltSelect(data);
              setupSearchFunctionality(data);
            })
            .catch((error) => console.error("Error fetching OLT data:", error));
        }
    });
}
  
  // Function to populate the OLT dropdown with data from JSON
  function populateOltSelect(data) {
    const oltSelect = document.getElementById("oltSelect");
    oltSelect.innerHTML = ""; // Clear previous options
  
    data.forEach((item) => {
      if (item.nama_olt) {
        const option = document.createElement("option");
        option.value = item.nama_olt;
        option.textContent = item.nama_olt;
        oltSelect.appendChild(option);
      }
    });
  }

  // Function to set up search functionality for OLT dropdown
function setupSearchFunctionality(data) {
    const searchInput = document.getElementById("searchOlt");
    const oltSelect = document.getElementById("oltSelect");
  
    searchInput.addEventListener("input", () => {
      const query = searchInput.value.toLowerCase();
      const filteredData = data.filter((item) =>
        item.nama_olt.toLowerCase().includes(query)
      );
      populateOltSelect(filteredData);
    });
  }
  
  // Function to set up search functionality for OLT dropdown
// function setupSearchFunctionality(data) {
//   const searchInput = document.getElementById("searchOlt");
//   const oltSelect = document.getElementById("oltSelect");

//   searchInput.addEventListener("input", () => {
//     const query = searchInput.value.toLowerCase();
//     const filteredData = data.filter((item) =>
//       item.nama_olt.toLowerCase().includes(query)
//     );
//     populateOltSelect(filteredData);
//   });
// }

  // Function to update OLT info based on the selected OLT
function updateOltInfo() {
    const selectedOlt = document.getElementById("oltSelect").value;
    const oltInfo = oltData.find((item) => item.nama_olt === selectedOlt);
  
    if (oltInfo) {
      document.getElementById("hsiInfo").textContent = `${oltInfo.hsi}`;
      document.getElementById("tr069Info").textContent = `${oltInfo.tr069}`;
    }
}


window.onload = fetchOltData;



function generateConfig() {
    const deviceSelected = document.getElementById("deviceSelect").value;
    const idPelanggan = document.getElementById("idPelanggan").value;
    const olt = document.getElementById("oltSelect").value;
    const sn = document.getElementById("sn").value;
    const slot = document.getElementById("slot").value;
    const port = document.getElementById("port").value;
    const onuId = document.getElementById("onuId").value;
    

  
    // Find the selected OLT data
    const oltInfo = oltData.find((item) => item.nama_olt === olt);
    const namaOLT = oltInfo ? oltInfo.nama_olt : "unknown";
    const hsi = oltInfo ? oltInfo.hsi : "unknown";
    const tr069 = oltInfo ? oltInfo.tr069 : "unknown";
  
    let configText = "";
    let configONT = "";
    let configTR = "";
    let configHSI = "";
  
    if (deviceSelected === "zte-c300-orbit") 
{
const paketPelanggan = document.getElementById("paket-pelanggan").value;
configText = `
configure t
interface gpon-olt_1/${slot}/${port}
onu ${onuId} type ZTEG-F679L sn ${sn}
!
interface gpon-onu_1/${slot}/${port}:${onuId}
  description ${idPelanggan}
  tcont 1 profile share-300m-b
  gemport 1 name inet tcont 1
  gemport 1 traffic-limit downstream 300m 
  gemport 2 name iptv tcont 1
  gemport 2 traffic-limit downstream 300m 
  gemport 3 name voip tcont 1
  gemport 3 traffic-limit downstream 300m 
  service-port 1 vport 1 user-vlan ${paketPelanggan} vlan ${paketPelanggan}
  service-port 2 vport 2 user-vlan 200 vlan 200 
  service-port 3 vport 3 user-vlan 300 vlan 300
  !   
    
pon-onu-mng gpon-onu_1/${slot}/${port}:${onuId}
  service inet gemport 1 vlan ${paketPelanggan}
  service iptv gemport 2 vlan 200
  wan-ip 1 mode dhcp vlan-profile vlan${paketPelanggan} host 1
  vlan port eth_0/2 mode tag vlan 200
  vlan port eth_0/3 mode tag vlan 200
  vlan port eth_0/4 mode tag vlan 200                                                   
  dhcp-ip ethuni eth_0/2 from-internet
  dhcp-ip ethuni eth_0/3 from-internet
  dhcp-ip ethuni eth_0/4 from-internet
  mvlan 200
  !
  
igmp mvlan 200 receive-port gpon-onu_1/${slot}/${port}:${onuId} vport 2
!
`;
document.getElementById("configOutput").value = configText;
}
    else if (deviceSelected === "huawei-orbit") 
{
const paketPelanggan = document.getElementById("paket-pelanggan").value;
let prof_id = '';
if(paketPelanggan == '407'){
    prof_id = '8';
} else if (paketPelanggan == '423'){
    prof_id = '84';
} else if (paketPelanggan == '409'){
    prof_id = '20';
}
configText = `
config
interface gpon 0/${slot}
ont add ${port} ${onuId} sn-auth "${sn}" omci ont-lineprofile-id ${prof_id}
ont-srvprofile-id 1 desc "${idPelanggan}"

ont ipconfig ${port} ${onuId} dhcp vlan ${paketPelanggan} priority 0
ont internet-config ${port} ${onuId} ip-index 0
ont wan-config ${port} ${onuId} ip-index 0 profile-id 1
ont port route ${port} ${onuId} eth 1 enable
ont port native-vlan ${port} ${onuId} eth 2 vlan 200 priority 0 
ont port native-vlan ${port} ${onuId} eth 3 vlan 200 priority 0 
ont port route ${port} ${onuId} eth 4 enable

quit

service-port vlan ${paketPelanggan} gpon 0/${slot}/${port} ont ${onuId} gemport 1 multi-service user-vlan ${paketPelanggan} tag-transform translate inbound traffic-table index 0 outbound 
traffic-table index 0
service-port vlan 200 gpon 0/${slot}/${port} ont ${onuId} gemport 2 multi-service user-vlan 200 tag-transform translate inbound traffic-table index 0 outbound 
traffic-table index 0
service-port vlan 300 gpon 0/${slot}/${port} ont ${onuId} gemport 3 multi-service user-vlan 300 tag-transform translate inbound traffic-table index 0 outbound 
traffic-table index 0 

`;
document.getElementById("configOutput").value = configText;
}
    else if (deviceSelected === "zte-c300") 
{
configText = `
configure t
interface gpon-olt_1/${slot}/${port}
onu ${onuId} type ZTEG-F679L sn ${sn}
!
interface gpon-onu_1/${slot}/${port}:${onuId}
description ${idPelanggan}
tcont 1 profile best-1G
gemport 1 name inet tcont 1
gemport 1 traffic-limit downstream 1g 
gemport 2 name TR-069 tcont 1
gemport 2 traffic-limit downstream 300m
service-port 1 vport 1 user-vlan 30 vlan ${hsi}
service-port 2 vport 2 user-vlan 20 vlan ${tr069}
!
pon-onu-mng gpon-onu_1/${slot}/${port}:${onuId}
service inet gemport 1 vlan 30
service tr gemport 2 vlan 20
wan-ip 2 mode dhcp vlan-profile vlan20 host 2
!
`;
document.getElementById("configOutput").value = configText;
}

else if (deviceSelected === "zte-c600") 
{
configText = `
conf t
interface gpon_olt-1/${slot}/${port}
onu ${onuId} type ZTEG-F679L SN ${sn} 
!
  
interface gpon_onu-1/${slot}/${port}:${onuId}
description ${idPelanggan}
tcont 1 profile best-1G
  gemport 1 name inet tcont 1
  gemport 2 name tr069 tcont 1
!
  
pon-onu-mng gpon_onu-1/${slot}/${port}:${onuId}
service inet gemport 1 vlan 30
service tr069 gemport 2 vlan 20
wan-ip ipv4 mode dhcp vlan-profile vlan20 host 2
!
  
interface vport-1/${slot}/${port}.${onuId}:1
service-port 1 user-vlan 30 vlan ${hsi}
service-port 1 description INET
qos traffic-policy 1G direction egress
!
  
interface vport-1/${slot}/${port}.${onuId}:2
service-port 2 user-vlan 20 vlan ${tr069}
service-port 2 description TR069
qos traffic-policy 300M direction egress
!
end
`;
document.getElementById("configOutput").value = configText;
}
else if (deviceSelected === "zte-c300-relabs") 
{
const usernamePPOE = document.getElementById("username-ppoe").value;
const passwordPPOE = document.getElementById("password-ppoe").value;
configText = `
configure t
interface gpon-olt_1/${slot}/${port}
onu ${onuId} type ZTEG-F679L sn ${sn}
!
interface gpon-onu_1/${slot}/${port}:${onuId}
description ${idPelanggan}
tcont 1 profile best-1G
gemport 1 name inet tcont 1
gemport 1 traffic-limit downstream 1g 
gemport 2 name TR-069 tcont 1
gemport 2 traffic-limit downstream 300m
service-port 1 vport 1 user-vlan 30 vlan 2503 
service-port 2 vport 2 user-vlan 20 vlan 2000 
!
pon-onu-mng gpon-onu_1/${slot}/${port}:${onuId}
service inet gemport 1 vlan 30
service TR-069 gemport 2 vlan 20
wan-ip 1 mode pppoe username ${usernamePPOE} password ${passwordPPOE} vlan-profile vlan30 host 1
!
`;
document.getElementById("configOutput").value = configText;
}
else if (deviceSelected === "huawei-hifi") 
{
configText = `
config
interface gpon 0/${slot}
ont add ${port} ${onuId} sn-auth "${sn}" omci ont-lineprofile-id 88
ont-srvprofile-id 1 desc "${idPelanggan}"

ont ipconfig ${port} ${onuId} pppoe vlan 30 priority 0 user-account ont-input
ont ipconfig ${port} ${onuId} ip-index 1 dhcp vlan 20 priority 5
ont internet-config ${port} ${onuId} ip-index 0
ont wan-config ${port} ${onuId} ip-index 0 profile-id 1
ont port route ${port} ${onuId} eth 1 enable
ont port route ${port} ${onuId} eth 2 enable
ont port route ${port} ${onuId} eth 3 enable
ont port route ${port} ${onuId} eth 4 enable
  
q
  
service-port vlan ${hsi} gpon 0/${slot}/${port} ont ${onuId} gemport 1 multi-service user-vlan 30 tag-transform translate inbound traffic-table index 500 outbound 
traffic-table index 0
service-port vlan ${tr069} gpon 0/${slot}/${port} ont ${onuId} gemport 2 multi-service user-vlan 20 tag-transform translate inbound traffic-table index 0 outbound 
traffic-table index  0
  
`;
document.getElementById("configOutput").value = configText;
}
else if (deviceSelected === "huawei-viberlink") 
{
const usernamePPOE = document.getElementById("username-ppoe").value;
const passwordPPOE = document.getElementById("password-ppoe").value;
configText = `
config
interface gpon 0/${slot}
ont add ${port} ${onuId} sn-auth "${sn}" omci ont-lineprofile-id 88
ont-srvprofile-id 1 desc "${idPelanggan}"

ont ipconfig ${port} ${onuId} pppoe vlan 30 priority 0 user-account username "${usernamePPOE}"
password "${passwordPPOE}"
ont ipconfig ${port} ${onuId} ip-index 1 dhcp vlan 20 priority 5
ont internet-config ${port} ${onuId} ip-index 0
ont wan-config ${port} ${onuId} ip-index 0 profile-id 1
ont port route ${port} ${onuId} eth 1 enable
ont port route ${port} ${onuId} eth 2 enable
ont port route ${port} ${onuId} eth 3 enable
ont port route ${port} ${onuId} eth 4 enable
  
q
  
service-port vlan 2501 gpon 0/${slot}/${port} ont ${onuId} gemport 1 multi-service user-vlan 30 tag-transform translate inbound traffic-table index 500 outbound 
traffic-table index 500
service-port vlan 2000 gpon 0/${slot}/${port} ont ${onuId} gemport 2 multi-service user-vlan 20 tag-transform translate inbound traffic-table index 0 outbound 
traffic-table index  0
  
`;
document.getElementById("configOutput").value = configText;
}
else if (deviceSelected === "huawei-relabs") 
{
const usernamePPOE = document.getElementById("username-ppoe").value;
const passwordPPOE = document.getElementById("password-ppoe").value;
configText = `
config
interface gpon 0/${slot}
ont add ${port} ${onuId} sn-auth "${sn}" omci ont-lineprofile-id 88
ont-srvprofile-id 1 desc "${idPelanggan}"

ont ipconfig ${port} ${onuId} pppoe vlan 30 priority 0 user-account username "${usernamePPOE}"
password "${passwordPPOE}"
ont ipconfig ${port} ${onuId} ip-index 1 dhcp vlan 20 priority 5
ont internet-config ${port} ${onuId} ip-index 0
ont wan-config ${port} ${onuId} ip-index 0 profile-id 1
ont port route ${port} ${onuId} eth 1 enable
ont port route ${port} ${onuId} eth 2 enable
ont port route ${port} ${onuId} eth 3 enable
ont port route ${port} ${onuId} eth 4 enable
  
q
  
service-port vlan 2503 gpon 0/${slot}/${port} ont ${onuId} gemport 1 multi-service user-vlan 30 tag-transform translate inbound traffic-table index 500 outbound 
traffic-table index 500
service-port vlan 2000 gpon 0/${slot}/${port} ont ${onuId} gemport 2 multi-service user-vlan 20 tag-transform translate inbound traffic-table index 0 outbound 
traffic-table index  0
  
`;
document.getElementById("configOutput").value = configText;
}
else if (deviceSelected === "nokia-hifi") 
{
const paketPelanggan = document.getElementById("paket-pelanggan").value;
configONT = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns="uri://alcatel.com/apc/9.7">
<soapenv:Header/>
    <soapenv:Body>
        <ns:configure>
            <objectName>${namaOLT}:1-1-${slot}-${port}-${onuId}</objectName>
            <templateName>ADD-ONT-PRECFG</templateName>
            <!--Optional:-->
            <templateVersion>1</templateVersion>
            <!--Optional:-->
            <instanceLabel/>
            <!--Zero or more repetitions:-->
            <argument>
                <name>ontSerialNumber</name>
                <value>${sn}</value>
             </argument>
             <argument>
                <name>configFiles_Config1_Planned</name>
                <value>CFGASIA005</value>
             </argument>
             <argument>
                <name>ontSubscriberId1</name>
                <value>${idPelanggan}</value>
            </argument>
            <!--Optional:-->
            <operationInitiator>1</operationInitiator>
        </ns:configure>
    </soapenv:Body>
</soapenv:Envelope> `;

configTR = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns="uri://alcatel.com/apc/9.7">
<soapenv:Header/>
   <soapenv:Body>
      <ns:configure>
         <objectName>${namaOLT}:1-1-${slot}-${port}-${onuId}</objectName>
         <templateName>ADD-TR069</templateName>
         <!--Optional:-->
         <templateVersion>1</templateVersion>
         <!--Optional:-->
         <instanceLabel/>
         <!--Zero or more repetitions:-->
         <argument>
            <name>networkCustomerId</name>
            <value>${tr069}</value>
         </argument>
         <argument>
            <name>qosSessionProfile</name>
            <value>UP-10M_DOWN-10M</value>
         </argument>
         <!--Optional:-->
         <operationInitiator>1</operationInitiator>
      </ns:configure>
   </soapenv:Body>
</soapenv:Envelope> `;

configHSI = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns="uri://alcatel.com/apc/9.7">
   <soapenv:Header/>
   <soapenv:Body>
      <ns:configure>
         <objectName>${namaOLT}:1-1-${slot}-${port}-${onuId}-14-1</objectName>
         <templateName>ADD-HSI</templateName>
         <!--Optional:-->
         <templateVersion>1</templateVersion>
         <!--Optional:-->
         <instanceLabel/>
         <!--Zero or more repetitions:-->
         <argument>
            <name>qosSessionProfile</name>
            <value>UP-${paketPelanggan}M_DOWN-${paketPelanggan}M</value>
         </argument>
         <argument>
            <name>networkCustomerId</name>
            <value>${hsi}</value>
         </argument>
         <!--Optional:-->
         <operationInitiator>1</operationInitiator>
      </ns:configure>
   </soapenv:Body>
</soapenv:Envelope> `;
document.getElementById("configONT").value = configONT;
document.getElementById("configTR").value = configTR;
document.getElementById("configHSI").value = configHSI;
}
else  if (deviceSelected === "nokia-viberlink") 
{
const paketPelanggan = document.getElementById("paket-pelanggan").value;
configONT = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns="uri://alcatel.com/apc/9.7">
<soapenv:Header/>
    <soapenv:Body>
        <ns:configure>
            <objectName>${namaOLT}:1-1-${slot}-${port}-${onuId}</objectName>
            <templateName>ADD-ONT-PRECFG</templateName>
            <!--Optional:-->
            <templateVersion>1</templateVersion>
            <!--Optional:-->
            <instanceLabel/>
            <!--Zero or more repetitions:-->
            <argument>
                <name>ontSerialNumber</name>
                <value>${sn}</value>
             </argument>
             <argument>
                <name>configFiles_Config1_Planned</name>
                <value>CFGASIA004</value>
             </argument>
             <argument>
                <name>ontSubscriberId1</name>
                <value>${idPelanggan}</value>
            </argument>
            <!--Optional:-->
            <operationInitiator>1</operationInitiator>
        </ns:configure>
    </soapenv:Body>
</soapenv:Envelope> `;

configTR = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns="uri://alcatel.com/apc/9.7">
<soapenv:Header/>
   <soapenv:Body>
      <ns:configure>
         <objectName>${namaOLT}:1-1-${slot}-${port}-${onuId}</objectName>
         <templateName>ADD-TR069</templateName>
         <!--Optional:-->
         <templateVersion>1</templateVersion>
         <!--Optional:-->
         <instanceLabel/>
         <!--Zero or more repetitions:-->
         <argument>
            <name>networkCustomerId</name>
            <value>2000</value>
         </argument>
         <argument>
            <name>qosSessionProfile</name>
            <value>UP-10M_DOWN-10M</value>
         </argument>
         <!--Optional:-->
         <operationInitiator>1</operationInitiator>
      </ns:configure>
   </soapenv:Body>
</soapenv:Envelope> `;

configHSI = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns="uri://alcatel.com/apc/9.7">
   <soapenv:Header/>
   <soapenv:Body>
      <ns:configure>
         <objectName>${namaOLT}:1-1-${slot}-${port}-${onuId}-14-1</objectName>
         <templateName>ADD-HSI</templateName>
         <!--Optional:-->
         <templateVersion>1</templateVersion>
         <!--Optional:-->
         <instanceLabel/>
         <!--Zero or more repetitions:-->
         <argument>
            <name>qosSessionProfile</name>
            <value>UP-${paketPelanggan}M_DOWN-${paketPelanggan}M</value>
         </argument>
         <argument>
            <name>networkCustomerId</name>
            <value>2501</value>
         </argument>
         <!--Optional:-->
         <operationInitiator>1</operationInitiator>
      </ns:configure>
   </soapenv:Body>
</soapenv:Envelope> `;
document.getElementById("configONT").value = configONT;
document.getElementById("configTR").value = configTR;
document.getElementById("configHSI").value = configHSI;
}
    
    
}

// fungsi untuk copy config ont
function copy(){
    if (deviceSelect.value == 'huawei-orbit' | deviceSelect.value == 'zte-c300-orbit' | deviceSelect.value == 'zte-c300' | deviceSelect.value == 'zte-c600' | deviceSelect.value == 'huawei-hifi' | deviceSelect.value == 'huawei-viberlink' | deviceSelect.value == 'zte-c300-relabs' | deviceSelect.value == 'huawei-relabs'){
    const textConfig = document.getElementById('configOutput');
    textConfig.select();
    document.execCommand('copy');
    document.getElementById('copy-btn').style.display = 'none';
    resultContainer.classList.add('active');
    window.getSelection().removeAllRanges();
    setTimeout(()=>{
        document.getElementById('copy-btn').style.display = 'block';
    resultContainer.classList.remove('active');
    },2500);
    }else if(deviceSelect.value === 'nokia-hifi' | deviceSelect.value === 'nokia-viberlink' ){
    const textConfig = document.getElementById('configONT');
    textConfig.select();
    document.execCommand('copy');
    document.getElementById('copy-btn').style.display = 'none';
    resultContainer.classList.add('active');
    window.getSelection().removeAllRanges();
    setTimeout(()=>{
        document.getElementById('copy-btn').style.display = 'block';
    resultContainer.classList.remove('active');
    },2500);
    } 
}

// fungsi untuk copy config TR
function copyTR(){
    const textConfig = document.getElementById('configTR');
    textConfig.select();
    document.execCommand('copy');
    document.getElementById('copy-btn').style.display = 'none';
    resultContainer.classList.add('active');
    window.getSelection().removeAllRanges();
    setTimeout(()=>{
        document.getElementById('copy-btn').style.display = 'block';
    resultContainer.classList.remove('active');
    },2500);
}

// fungsi untuk copy config HSI
function copyHSI(){
    const textConfig = document.getElementById('configHSI');
    textConfig.select();
    document.execCommand('copy');
    document.getElementById('copy-btn').style.display = 'none';
    resultContainer.classList.add('active');
    window.getSelection().removeAllRanges();
    setTimeout(()=>{
        document.getElementById('copy-btn').style.display = 'block';
    resultContainer.classList.remove('active');
    },2500);
}

function clearForm() {
    document.getElementById("deviceSelect").value = "";
    document.getElementById("oltSelect").innerHTML = ""; // Clear OLT options
    document.getElementById("searchOlt").value = "";
    document.getElementById("idPelanggan").value = "";
    document.getElementById("sn").value = "";
    document.getElementById("slot").value = "";
    document.getElementById("port").value = "";
    document.getElementById("onuId").value = "";
    document.getElementById("configOutput").value = "";
    document.getElementById("configONT").value = "";
    document.getElementById("configTR").value = "";
    document.getElementById("configHSI").value = "";
    document.getElementById("hsiInfo").textContent = "HSI: ";
    document.getElementById("tr069Info").textContent = "TR-069: ";
}


// let jsonData = [];
// let selectedColumns = [];

// // Load data from localStorage when the page loads
// window.addEventListener('load', () => {
//     const storedData = localStorage.getItem('convertedData');
//     if (storedData) {
//         const parsedData = JSON.parse(storedData);
//         displayJson(parsedData);
//         document.getElementById('searchSection').style.display = 'block';
//         document.getElementById('clearData').style.display = 'inline-block';
//         document.getElementById('downloadButton').style.display = 'inline-block';
//     }
// });

// function displayJson(data) {
//     const result = document.getElementById('result');
//     result.textContent = JSON.stringify(data, null, 2);
//     // filterResults(); // Apply search filter to the newly displayed results
// }

// function downloadJson() {
//     const convertedData = localStorage.getItem('convertedData');
//     if (!convertedData) {
//         alert('No data available to download.');
//         return;
//     }

//     const blob = new Blob([convertedData], { type: 'application/json' });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = 'hasil.json';
//     document.body.appendChild(a);
//     a.click();
//     document.body.removeChild(a);
// }

// function filterResults() {
//     const searchTerm = document.getElementById('searchInput').value.toLowerCase().replace(/\s+/g, ''); // Remove all whitespace
//     const storedData = localStorage.getItem('convertedData');
    
//     if (!storedData) {
//         document.getElementById('result').textContent = 'No data available.';
//         return;
//     }

//     const jsonData = JSON.parse(storedData);

//     const filteredData = jsonData.filter(item => 
//         Object.values(item).some(value => {
//             if (typeof value === 'string') {
//                 // Remove whitespace and convert to lowercase for comparison
//                 const cleanValue = value.toLowerCase().replace(/\s+/g, '');
//                 return cleanValue.includes(searchTerm);
//             }
//             return false;
//         })
//     );

// // Limit the number of items to display to 2
// const limitedData = filteredData.slice(0, 2);

// document.getElementById('customer-detail').textContent = JSON.stringify(limitedData, null, 2);
// }

// function clearLocalStorage() {
//     localStorage.removeItem('convertedData');
//     document.getElementById('result').textContent = '';
//     document.getElementById('searchInput').value = '';
//     document.getElementById('searchSection').style.display = 'none';
//     document.getElementById('downloadButton').style.display = 'none';
//     document.getElementById('clearData').style.display = 'none';
//     document.getElementById('clearStorageButton').style.display = 'none';
//     alert('Local storage cleared.');
// }
