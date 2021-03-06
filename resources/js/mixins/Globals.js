
export const Globals = {
    data: function () {
        return {
            alphanumeric: /^[A-Za-z0-9\.,\-\"\()ÑñäÄëËïÏöÖüÜáéíóúáéíóúÁÉÍÓÚÂÊÎÔÛâêîôûàèìòùÀÈÌÒÙ\s]+$/,
            email: /^(([^<>()\[\]\.,;:\s@\”]+(\.[^<>()\[\]\.,;:\s@\”]+)*)|(\”.+\”))@(([^<>()[\]\.,;:\s@\”]+\.)+[^<>()[\]\.,;:\s@\”]{2,})$/,
            phone: /^[0-9]{2}(-)[0-9]{4}(-)[0-9]{4}$/,
            zip_code:/([0-9]{5})/gi,
            color: /^[\#][a-zA-Z0-9]{6}$/gi,
            //zip_code:/([0-9]{2})(-)([0-9]{4})(-)([0-9]{4})/gi,
            message: {
                ruleForm:{
                    required: 'Este campo es requerido.',
                    special_characters: 'Este campo no admite caracteres especiales.',
                    special_characters_email: 'Ingrese un correo eléctronico valido.',
                    max_characters:'Este campo solo adminite maximo',
                    max_characters_phone:'Este campo debe contener 10 numeros.',
                    submit_error: 'Revise los campos del formulario.',
                    find_contact_succes: 'Sus datos han sido enviados exitosamenrte.',
                    find_contact_fail: 'Este contacto ya fue registrado, intente con otro datos diferentes.',
                },
                axios:{
                    error: 'Error en la acción.'
                }
            },
            headers: { headers:
                    {
                        'X-Requested-With': 'XMLHttpRequest',
                        'Accept': 'application/json',
                        'Accept-C': window.acceptC,
                        'Authorization': 'Bearer ' + sessionStorage.getItem('access_token')
                    }
            }
        }
    },
    methods:{
        validT(rule, value, callback){
            if (value){
                value = value.trim();
                let exp = new RegExp(/(<\\xml|<\/script|<\/|<\\script|<script|<xml|<\\|\?>|<\?xml|(<\?php|<\?|\?\>)|java|xss|htaccess)/,'igm');
                if (exp.test(value)) {
                    return callback(new Error('Formato incorrecto'));
                } else {
                    return callback();
                }
            }else {
                return callback();
            }
        },
        getCats(){
            axios.get('/api/getCats', this.headers ).then(response => {
                if(response.data.success){
                    this.$store._modules.root.state.totalplay.catCities = response.data.lResults.CatCity;
                    let Wallpaper = response.data.lResults.Wallpaper;
                    if( Wallpaper.isColor === 1 ){
                        this.$store._modules.root.state.totalplay.Wallpaper = "background: "+Wallpaper.color+";";
                    }else{
                        this.$store._modules.root.state.totalplay.Wallpaper = "background: url("+Wallpaper.fileNameHash+"); background-size: 100% 100%; background-attachment: fixed;";
                    }
                }
            }).catch(error => {
                this.$message({
                    message: 'No se pudo completarr la acción.',
                    type: 'warning'
                });
                console.error(error);
            });
        },
        setPacks(type = true){
            this.$store._modules.root.state.totalplay.loading = true;
            let selectCity = parseInt(localStorage.getItem('selectCity'));
            axios.post('/api/setPacks',{
                city: selectCity ? selectCity: 9,
                typePack: type
            },this.headers).then(response => {
                if(response.data.success){
                    this.$store._modules.root.state.totalplay.catHome = response.data.lResults.catHome;
                    this.$store._modules.root.state.totalplay.catAmazon = response.data.lResults.catAmazon;
                    this.$store._modules.root.state.totalplay.catNetflix = response.data.lResults.catNetflix;
                    this.$store._modules.root.state.totalplay.imgBannerNetflix = response.data.lResults.imgBannerNetflix;
                    this.$store._modules.root.state.totalplay.imgBannerAmazon = response.data.lResults.imgBannerAmazon;
                    this.$store._modules.root.state.totalplay.imgSlider = response.data.lResults.imgSlider;
                    this.$store._modules.root.state.totalplay.footer2 = response.data.lResults.Footer2;
                    this.$store._modules.root.state.totalplay.main = "height:400px; background: url("+response.data.lResults.main+"); background-size: 100% 100%;";
                    setTimeout(() => {
                        this.$store._modules.root.state.totalplay.loading = false;
                    }, 1000);
                }
            }).catch(error => {
                setTimeout(() => {
                    this.$store._modules.root.state.totalplay.loading = false;
                }, 1000);
                console.error(error);
                this.$message({
                    message: 'No se pudo completarr la acción.',
                    type: 'warning'
                });
            });
        },
        idx(array,from){
            let sum = from;
            let data = [];
            for (let i = 0; i < array.length; i++) {
                sum = i === 0 ? sum : (sum + 1);
                array[i].idx = sum;
                data.push(array[i]);
            }
            return data;
        },
        filesArrayImg(imgs){
            let data = [];
                if( imgs.length > 0 ){
                    data = [{ id: imgs[0].id, name: imgs[0].fileName ,url: imgs[0].fileNameHash }];
                }
            return data;
        }
    }
};
