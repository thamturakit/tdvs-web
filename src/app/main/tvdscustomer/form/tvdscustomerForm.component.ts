import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { fuseAnimations } from '@fuse/animations';

import { Location } from '@angular/common';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

import { locale as english } from '../i18n/en';
import { locale as thai } from '../i18n/th';

import { TvdscustomerService } from '../services/tvdscustomer.service';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-tvdscustomer-form',
  templateUrl: './tvdscustomerForm.component.html',
  styleUrls: ['./tvdscustomerForm.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class TvdscustomerFormComponent implements OnInit {
  tvdscustomerForm: FormGroup;
  tvdscustomerData: any = {};

  postcodesList: any = [];
  temp = [];

  title: Array<any> = [
    { value: 'นาย', viewValue: 'นาย' },
    { value: 'นาง', viewValue: 'นาง' },
    { value: 'นางสาว', viewValue: 'นางสาว' }
  ];
  
  constructor(
    private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    private location: Location,
    private formBuilder: FormBuilder,
    private tvdscustomerService: TvdscustomerService,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService
  ) {
    this._fuseTranslationLoaderService.loadTranslations(english, thai);
  }


  ngOnInit(): void {

    this.tvdscustomerService.getPostcodesList().subscribe((res: any) => {
      this.postcodesList = res.data;
      this.temp = res.data;
    })

    this.tvdscustomerData = this.route.snapshot.data.items
      ? this.route.snapshot.data.items.data
      : {
        title: "",
        firstName: "",
        lastName: "",
        persanalId: "",
        mobileNo1: "",
        mobileNo2: "",
        mobileNo3: "",
        addressLine1: "",
        addressStreet: "",
        addressSubdistric: "",
        addressDistric: "",
        addressProvince: "",
        addressPostcode: ""
      };

    if (this.tvdscustomerData._id) {
      console.log('case Edit');
      this.tvdscustomerForm = this.editForm();
    } else {
      console.log('case New');
      this.tvdscustomerForm = this.createForm();
    }

    this.spinner.hide();
  }

  createForm(): FormGroup {
    return this.formBuilder.group({
      title: [this.tvdscustomerData.title, Validators.required],
      firstName: [this.tvdscustomerData.firstName, Validators.required],
      lastName: [this.tvdscustomerData.lastName, Validators.required],
      persanalId: [this.tvdscustomerData.persanalId, Validators.required],
      mobileNo1: [this.tvdscustomerData.mobileNo1, Validators.required],
      mobileNo2: [this.tvdscustomerData.mobileNo2, Validators.required],
      mobileNo3: [this.tvdscustomerData.mobileNo3, Validators.required],
      addressLine1: [this.tvdscustomerData.addressLine1, Validators.required],
      addressStreet: [this.tvdscustomerData.addressStreet, Validators.required],
      addressSubdistric: [this.tvdscustomerData.addressSubdistric, Validators.required],
      addressDistric: [this.tvdscustomerData.addressDistric, Validators.required],
      addressProvince: [this.tvdscustomerData.addressProvince, Validators.required],
      addressPostcode: [this.tvdscustomerData.addressPostcode, Validators.required],
    });
  }
  editForm(): FormGroup {
    return this.formBuilder.group({
      title: [this.tvdscustomerData.title, Validators.required],
      firstName: [this.tvdscustomerData.firstName, Validators.required],
      lastName: [this.tvdscustomerData.lastName, Validators.required],
      persanalId: [this.tvdscustomerData.persanalId, Validators.required],
      mobileNo1: [this.tvdscustomerData.mobileNo1, Validators.required],
      mobileNo2: [this.tvdscustomerData.mobileNo2, Validators.required],
      mobileNo3: [this.tvdscustomerData.mobileNo3, Validators.required],
      addressLine1: [this.tvdscustomerData.addressLine1, Validators.required],
      addressStreet: [this.tvdscustomerData.addressStreet, Validators.required],
      addressSubdistric: [this.tvdscustomerData.addressSubdistric, Validators.required],
      addressDistric: [this.tvdscustomerData.addressDistric, Validators.required],
      addressProvince: [this.tvdscustomerData.addressProvince, Validators.required],
      addressPostcode: [this.tvdscustomerData.addressPostcode, Validators.required],
    });
  }

  goBack() {
    this.spinner.show();
    this.location.back();
  }

  async onSave() {
    this.spinner.show();

    if (this.tvdscustomerData._id) {
      this.tvdscustomerForm.value._id = this.tvdscustomerData._id;
      this.tvdscustomerService
        .updateTvdscustomerData(this.tvdscustomerForm.value)
        .then(res => {
          // console.log(res);
          this.location.back();
        })
        .catch(err => {
          this.spinner.hide();
        });
    } else {
      this.tvdscustomerService
        .createTvdscustomerData(this.tvdscustomerForm.value)
        .then(() => {
          this.location.back();
        })
        .catch(err => {
          this.spinner.hide();
        });
    }
  }

  updateFilter(event) {
    //change search keyword to lower case
    const val = event.target.value.toLowerCase();

    // filter our data
    const temp = this.temp.filter(function (d) {
      return d.postcode.toLowerCase().indexOf(val) !== -1 || !val;
    });

    // update the rows
    this.postcodesList = temp;
    console.log(this.postcodesList);
  }

  getPosts(val) {
    //12150 | บึงคำพร้อย | อำเภอลำลูกกา | ปทุมธานี
    let viewValue = val.viewValue;
    let arrValue = val.viewValue.split("|");
    let subdistrict = arrValue[1].trim();
    let district = arrValue[2].trim();
    let province = arrValue[3].trim();

    this.tvdscustomerForm.controls["addressProvince"].setValue(province);
    this.tvdscustomerForm.controls["addressDistric"].setValue(district);
    this.tvdscustomerForm.controls["addressSubdistric"].setValue(subdistrict);
  }


}
