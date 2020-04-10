import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators, FormArray } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';
import { AuthenService } from '../authen.service';
import { Router, ActivatedRoute } from '@angular/router';
import { InvolvedpartyService } from 'app/main/involvedparty/services/involvedparty.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Location } from '@angular/common';

@Component({
    selector: 'register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class RegisterComponent implements OnInit, OnDestroy {
    registerForm: FormGroup;
    directContact: FormArray;
    registerData: any = {};

    // Private
    private _unsubscribeAll: Subject<any>;

    constructor(
        private _fuseConfigService: FuseConfigService,
        private formBuilder: FormBuilder,
        private involvedpartyService: InvolvedpartyService,
        private route: ActivatedRoute,
        private spinner: NgxSpinnerService,
        private location: Location,
    ) {
        // Configure the layout
        this._fuseConfigService.config = {
            layout: {
                navbar: {
                    hidden: true
                },
                toolbar: {
                    hidden: true
                },
                footer: {
                    hidden: true
                },
                sidepanel: {
                    hidden: true
                }
            }
        };

        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */

    title: Array<any> = [
        { value: 'นาย', viewValue: 'นาย' },
        { value: 'นาง', viewValue: 'นาง' },
        { value: 'นางสาว', viewValue: 'นางสาว' }
    ];

    ngOnInit(): void {
        this.registerData = this.route.snapshot.data.items
            ? this.route.snapshot.data.items.data
            : {
                personalInfo: {
                    title: "",
                    firstName: "",
                    lastName: "",
                    citizenId: ""
                },
                contactAddress: {
                    addressLine1: "",
                    addressStreet: "",
                    addressSubDistrict: "",
                    addressDistrict: "",
                    addressProvince: "",
                    addressPostalCode: "",
                }
            };

        if (this.registerData._id) {
            console.log('case Edit');
            this.registerForm = this.editForm();
            this.caseEditArray()
        } else {
            console.log('case New');
            this.registerForm = this.createForm();
        }
        this.spinner.hide();
    }

    createForm(): FormGroup {
        return this.formBuilder.group({
            personalInfo: this.createPersonalInfoForm(),
            directContact: this.formBuilder.array([
                this.formBuilder.group(
                    {
                        method: "mobile",
                        value: ""
                    }
                ),
                this.formBuilder.group(
                    {
                        method: "home",
                        value: ""
                    }
                ),
                this.formBuilder.group(
                    {
                        method: "other",
                        value: ""
                    }
                )
            ]),
            contactAddress: this.createContactAddressForm(),
        });
    }

    createPersonalInfoForm(): FormGroup {
        return this.formBuilder.group({
            title: [this.registerData.personalInfo.title],
            firstName: [this.registerData.personalInfo.firstName],
            lastName: [this.registerData.personalInfo.lastName],
            citizenId: [this.registerData.personalInfo.citizenId]
        });
    }

    createContactAddressForm(): FormGroup {
        return this.formBuilder.group({
            addressLine1: [this.registerData.contactAddress.addressLine1],
            addressStreet: [this.registerData.contactAddress.addressStreet],
            addressSubDistrict: [this.registerData.contactAddress.addressSubDistrict],
            addressDistrict: [this.registerData.contactAddress.addressDistrict],
            addressProvince: [this.registerData.contactAddress.addressProvince],
            addressPostalCode: [this.registerData.contactAddress.addressPostalCode],
        });
    }

    editForm(): FormGroup {
        return this.formBuilder.group({
            personalInfo: this.createPersonalInfoForm(),
            directContact: this.formBuilder.array([]),
            contactAddress: this.createContactAddressForm(),
        });
    }
    caseEditArray() {
        this.directContact = this.registerForm.get('directContact') as FormArray;
        this.registerData.directContact.forEach(el => {
            this.directContact.push(this.formBuilder.group(
                {
                    method: el.method,
                    value: el.value
                }
            ));
        });
    }

    goBack() {
        this.spinner.show();
        this.location.back();
    }

    async onSave() {
        this.spinner.show();

        if (this.registerData._id) {
            this.registerForm.value._id = this.registerData._id;
            this.involvedpartyService
                .updateInvolvedpartyData(this.registerForm.value)
        } else {
            this.involvedpartyService
                .createInvolvedpartyData(this.registerForm.value)
        }
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    /**
     * On register button click
     */
}

/**
 * Confirm password validator
 *
 * @param {AbstractControl} control
 * @returns {ValidationErrors | null}
 */
