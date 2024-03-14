import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { TextField } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import TablePagination from '@mui/material/TablePagination';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';
import Swal from 'sweetalert2';
import Button from '@mui/material/Button';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Acceuil from './Acceuill';

function createData(num_materiel, design, etat,quantite,loyer,Action) {
  const density = loyer / Action;
  return {num_materiel, design, etat,quantite,loyer, Action,density };
}
const columns = [
  { id: 'num_materiel', label: 'Numéro du materiel', maxWidth: '5%'},
  { id: 'design', label: 'Design' },
  { id: 'etat', label: 'État' },
  { id: 'quantite', label: 'Quantité' },

  { id: 'loyer', label: '' },
  { id: 'Action', label: '' },
 
];
export default class Etudiant extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        open: false,
        id:'',
        num_materiel: '',
        design : '', 
        etat : '',
        quantite: '',
        SommeM: '',
        erreur:'',
        row: [],
        openProductEditModal: false, 
        page:0,
        rowsPerPage:10 
      };
  
      this.handleChange = this.handleChange.bind(this);
      this.handleClickOpen=this.handleClickOpen.bind(this);
      this.handleClose=this.handleClose.bind(this);
      this.onChange=this.onChange.bind(this);
      this.submitupdate=this.submitupdate.bind(this);
      this.submitNewOrg=this.submitNewOrg.bind(this)
      this.handleProductEditClose=this.handleProductEditClose.bind(this);
      this.handleProductEditOpen=this.handleProductEditOpen.bind(this);
      this.getEtudiant=this.getEtudiant.bind(this);
      this.getMaterielSum =this.getMaterielSum.bind(this)
      this.handleCloseCond=this.handleCloseCond.bind(this)
      this.deleteOrg=this.deleteOrg.bind(this)
      
      this.handleChangePage=this.handleChangePage.bind(this);
      this.handleChangeRowsPerPage=this.handleChangeRowsPerPage.bind(this)
    }
  componentDidMount () {

    this.getEtudiant()
      }
  handleClickOpen () {
    this.setState({
       open: true,
      });
  };
  handleCloseCond  ()  {
    this.setState({
        open: false,});
      };
  handleClose  ()  {
    this.setState({
        open: false,
        num_materiel: '',
        design : '', 
        etat : '',
        quantite: '',
      
    });
  };
  getMaterielSum (){
    //alert(this.state.design + " , " + this.state.idorg + " , " +  this.state.lieu)
    axios.get("http://127.0.0.1:2000/materieletat").then((response) => {
 
      const sommeBon = response.data[0].somme_bon;
      const sommeMauvais = response.data[0].somme_Mauvais;
      const sommeAbime = response.data[0].somme_Abimé;
      const nombre_total = response.data[0].nombre_total
    
      // Créez un tableau contenant ces valeurs
      const sommeArray = [sommeBon, sommeMauvais, sommeAbime,nombre_total];
      console.log(sommeArray)
      this.setState({
        SommeM: sommeArray,
       });
       console.log(response.data)
    }).catch((err) => {
      console.log(err)
    });
  }
  getEtudiant (){
  
    //alert(this.state.design + " , " + this.state.idorg + " , " +  this.state.lieu)
    axios.get("http://127.0.0.1:2000/materiel").then((response) => {
      this.setState({
        row: response.data,
       });
       console.log(this.state.row)
       console.log(response.data)
    }).catch((err) => {
    
      console.log(err)
    });
    this.getMaterielSum ()
  }

  submitNewOrg (){
  
    this.setState({ erreur: '' })
    axios.post(`http://127.0.0.1:2000/materiel`, {
        design : this.state.design, 
        etat : this.state.etat,
        quantite: this.state.quantite,
    }).then((res) => {
      this.handleCloseCond()
      if(res.data==="num_materiel dejà  utiisé"){
        Swal.fire({
          icon: 'error',
          title: 'Ce numéro de num_materiel est dejà  utiisé',
          showConfirmButton: false,
          timer: 2000
      })
      setTimeout(()=>{
        this.handleClickOpen()
    },2000)
      }
      else{
        Swal.fire({
          icon: 'success',
          title: 'La materiel a été bien ajouter',
          showConfirmButton: false,
          timer: 1500
      })
     
     
    this.setState({
        open: false,
        num_materiel: '',
        design : '', 
        etat : '',
        quantite: '',
       
    }); }
    this.getEtudiant()
    }).catch((err) => {
      Swal.fire({
        icon: 'error',
        title: "Quelque chose s'est  mal passer",
        showConfirmButton: false,
        timer: 2000
    })
    });
   } 
  submitupdate (){
   
      this.setState({ erreur: '' })  
    axios.put(`http://127.0.0.1:2000/materiel/${this.state.num_materiel}`, {
      design : this.state.design, 
      etat : this.state.etat,
      quantite: this.state.quantite,

    }).then((res) => {
       console.log(res)
       Swal.fire({
        icon: 'success',
        title: 'Le(s) modification(s) ont été Enregister',
        showConfirmButton: false,
        timer: 2000
    })
    this.getEtudiant()
       this.handleProductEditClose()
       this.setState({
        open: false,
        num_materiel: '',
        design : '', 
        etat : '',
        quantite: '',
       
      });
    }).catch((err) => {
      alert("Une Erreur s'est produite")
      console.log(err)
    });
  
  }
  deleteOrg(num_materiel){
    console.log(num_materiel)
    Swal.fire({
      title: ' Êtes vous sûr?',
      text: "Cette action est irreversible ",
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Retour',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Supprimer'
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`http://127.0.0.1:2000/materiel/${num_materiel}`).then((res) => {
          this.getEtudiant()
          Swal.fire({
            icon: 'success',
            title: 'Cette element a été bien supprimer',
            showConfirmButton: false,
            timer: 1500
        })
       }).catch(function (error) {
        console.log("sqsqsq")
         console.log(error)
           Swal.fire({
                  icon: 'error',
                  title: 'Cette action n\'a pas pu aboutir ',
                  showConfirmButton: false,
                  timer: 1500
              })
          });
      }
    })
  }
 
  onChange (e) {
    this.setState({ [e.target.name]: e.target.value });
  }
 handleChange(event) {
    this.setState({value: event.target.value});
  }
  handleProductEditOpen = (data) => {
      this.setState({
        openProductEditModal: true,
        num_materiel: data.num_materiel,
        design : data.design, 
        etat : data.etat,
        quantite: data.quantite,
     
    });
  };
  handleProductEditClose = () => {
    this.setState({ 
      openProductEditModal: false,
      num_materiel: '',
      design : '', 
      etat : '',
      quantite: '',
 

     });
   
  };
   handleChangePage  (event, newPage)  {
    this.setState({ page: newPage });
  };

  handleChangeRowsPerPage  (event)  {
    this.setState({ rowsPerPage: +event.target.value,page:0 });
  };
 
    render() {
   
      const rows=[];
      if (`${this.state.row}`.length !== 0) {
     this.state.row.map((data) => {

       rows.push(
        createData( data.num_materiel,data.design,data.etat,
            data.quantite,
            <TableCell align="right"
                sx={{display:'flex',justifyContent:'space-between',width:'50%'}}
            >
                  
            <Button size="large" onClick={(e) => this.deleteOrg(data.num_materiel)}  variant="none">
                <DeleteIcon
                  color="error"
                ></DeleteIcon>
            </Button>
            <Button size="large" onClick={(e) => this.handleProductEditOpen(data)} variant="none">
              <ModeEditIcon  color='warning' >
            </ModeEditIcon> 
            </Button>
   </TableCell>)
       
       )
     })}
      return (
        <div style={{overflow:'hidden'}}>
        <h1 style={{textAlign:'center',}}>Gestion de materiel</h1>
    <Paper sx={{ width: '92%',marginLeft:'5%' ,
       marginTop:'26px',overflowY:'hidden'}}>
      <TableContainer sx={{ maxHeight: 475 }}>
        <Table stickyHeader aria-label="sticky table"
         sx={{ maxWidth:'100%' }}
        >
          <TableHead>
            <TableRow >
              <TableCell align="center" colSpan={8}>
              <AddIcon 
               sx={{ fontSize: 40,color:'white',borderRadius:'50%',backgroundColor:"blue" }}
               onClick={this.handleClickOpen}
               />

              </TableCell>
            </TableRow>
            <TableRow  >
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ top: 70, minWidth: column.minWidth,fontSize:'15px',color:'rgba(145, 84, 4, 0.63)',fontFamily:'Verdana, Geneva, Tahoma, sans-serif' }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .slice(this.state.page * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage + this.state.rowsPerPage)
              .map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.format && typeof value === 'number'
                            ? column.format(value)
                            : value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 15]}
        component="div"
        count={rows.length}
        rowsPerPage={this.state.rowsPerPage}
        page={this.state.page}
        onPageChange={this.handleChangePage}
        onRowsPerPageChange={this.handleChangeRowsPerPage}
      />
    </Paper>
      {console.log(this.state.SommeM)}
<Acceuil SommeM={this.state.SommeM}></Acceuil>

                            {/* <------------------------ Ajout d'une materiel------------------------> */}
        <Dialog
          open={this.state.open}
          sx={{
            opacity:1,
          }}
          PaperProps={{ sx: { width: "100%",   overflowY:"hidden" } }}
        
          keepMounted
          onClose={this.handleClose}
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle><h3 style={{textAlign:'center'}}>Ajouter une materiel</h3></DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
            <div className='divi'> 
            <form className="publier">
                <div>
                  </div>
                  <div style={{marginTop:'10px',fontWeight:"800"}}>
          
                  <TextField
                   multiline
                   name='design'
                   label="Design"
                    type="text" 
                    id="outlined-multiline-flexible"
                    maxRows={4}
                    style={{width: "65%",marginLeft:'18%',marginTop:'20px'}} 
                    value={this.state.design}
                    onChange={this.onChange}
                  />
                  </div> 
                  <div style={{marginTop:'10px',fontWeight:"800"}}>
          
                    <FormControl fullWidth 
              sx={{width: "65%",marginLeft:'18%',marginTop:'20px'}} 
              
        >
            <InputLabel id="demo-simple-select-label">État</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              name='etat'

              label="État"
             
              value={this.state.etat}
              onChange={this.onChange}
            >  
               <MenuItem value={"Bon"}>Bon</MenuItem>
              <MenuItem value={"Mauvais"}>Mauvais</MenuItem>
              <MenuItem value={"Abimé"}>Abimé</MenuItem>
        
              

            </Select>
          </FormControl>
           <div style={{marginTop:'10px',fontWeight:"800"}}>
          </div> 
          <TextField
           multiline
        
              id="demo-simple-select"
              name='quantite'
            type="text" 
            maxRows={4}
            style={{width: "65%",marginLeft:'18%',marginTop:'20px'}} 
           
            value={this.state.quantite}
            label="Quantité"
            onChange={this.onChange}
          />
          </div> 
      <div style={{marginTop:'10px',fontWeight:"800"}}>
          

          </div> 
          <span style={{color:'red',marginLeft:'18%'}}>{this.state.erreur} </span> 
              </form>
          
            </div>
            </DialogContentText>
          </DialogContent>
          <DialogActions style={{paddingRight:'20px'}}>
          {/* <input type="button" onClick={this.handleClose} value="Annuler" id="publier"/> */}
        <Button variant="contained" size="medium" onClick={this.handleClose} id="publier">Annuler</Button>
        <Button variant="contained"
        disabled={
           this.state.design === '' ||
          this.state.etat === ''||
          this.state.quantite=== ''
       
          }
          size="medium" onClick={this.submitNewOrg} 
          id="publier"
          color="secondary"
          sx={{marginLeft:'3px',backgroundColor:'pink'}}
         >Ajouter</Button>
          
        
          
          </DialogActions>
        </Dialog>

                              {/* <------------------------Modification LA materiel-----------------------> */}
        <Dialog
          open={this.state.openProductEditModal}
          sx={{
            opacity:1,
          }}
          PaperProps={{ sx: { width: "100%",   overflowY:"hidden" } }}
        
          keepMounted
          onClose={this.handleProductEditClose}
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle><h3 style={{textAlign:'center'}}>Modifier le(s) donnée(s) d'un Etudiant </h3></DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
            <div className='divi'> 
            <form className="publier">
                <div>
                   <TextField
                      id="outlined-multiline-flexible"
                      label="Numéro du materiel"
                      multiline
                      maxRows={4}
                      name='num_materiel'
                      style={{width: "65%",marginLeft:'18%',marginTop:'20px'}} 
                      value={this.state.num_materiel}
                  />
                  
                  </div>
                  <div style={{marginTop:'10px',fontWeight:"800"}}>
          
                  <TextField
                   multiline
                   name='design'
                   label="Design"
                    type="text" 
                    id="outlined-multiline-flexible"
                    maxRows={4}
                    style={{width: "65%",marginLeft:'18%',marginTop:'20px'}} 
                    value={this.state.design}
                    onChange={this.onChange}
                  />
                  </div> 
                  <div style={{marginTop:'10px',fontWeight:"800"}}>
          
                  <FormControl fullWidth 
              sx={{width: "65%",marginLeft:'18%',marginTop:'20px'}} 
              
        >
            <InputLabel id="demo-simple-select-label">État</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              name='etat'

              label="État"
             
              value={this.state.etat}
              onChange={this.onChange}
            >  
               <MenuItem value={"Bon"}>Bon</MenuItem>
              <MenuItem value={"Mauvais"}>Mauvais</MenuItem>
              <MenuItem value={"Abimé"}>Abimé</MenuItem>
        
              

            </Select>
          </FormControl>
           <div style={{marginTop:'10px',fontWeight:"800"}}>
          </div> 
          <TextField
           multiline
        
              id="demo-simple-select"
              name='quantite'
            type="text" 
            maxRows={4}
            style={{width: "65%",marginLeft:'18%',marginTop:'20px'}} 
           
            value={this.state.quantite}
            label="Quantite"
            onChange={this.onChange}
          />
          </div> 
   
       
          
          <div style={{marginTop:'10px',fontWeight:"800"}}>
          

          </div> 
          <span style={{color:'red',marginLeft:'18%'}}>{this.state.erreur} </span> 
              </form>
          
            </div>
            </DialogContentText>
          </DialogContent>
          <DialogActions style={{paddingRight:'20px'}}>
          {/* <input type="button" onClick={this.handleClose} value="Annuler" id="publier"/> */}
          <Button variant="contained" size="medium" onClick={this.handleProductEditClose} id="publier">Annuler</Button>
        <Button variant="contained"
          size="medium" onClick={this.submitupdate}
          id="publier"
          color="secondary"
          sx={{marginLeft:'20px',backgroundColor:'pink'}}
          disabled={
             this.state.design === '' ||
            this.state.etat === ''||
            this.state.quantite=== ''
            }
         >Modifier</Button>
          </DialogActions>
        </Dialog>
      </div>
      );
    }
  }