//Interface to capture the Date and NAV values
export interface MFdatenav {
    date: string;
    nav: string;
}
//Interface to capture the fund meta
export interface MfMeta {
  fund_house: string;
  scheme_type: string;
  scheme_category: string;
  scheme_code: number;
  scheme_name: string;
  isin_growth: string | null;
  isin_div_reinvestment: string | null;
}
//To store the NAAV, date and rolling returns rolling returns will have 0 values as well.
export interface PosNegRollingRet_Nav {
    date: string;
    nav: string;
    rollingret: string;
    percentage: string;
}

export interface Inttakeaways {
    rollingretdays: number;
    totdatapoints: number;
    applicabledatapoints: number;
    postiverollingreturn: string;
    negativeRollingReturns: string;
    notapplicableRollingReturns: number;
}
export interface Intmfdetails {
    schemecode: string;
    schemename: string;
    schemecategory: string;
    date: string;
    nav: string;
    retsummary: string;
}
export interface mymfdatajson {
    schemecode: Number;
    schemename: string;
}

export interface SchemeNav {
  schemeCode: string;
  schemeName: string;
}
