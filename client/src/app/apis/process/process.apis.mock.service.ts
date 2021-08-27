import {Injectable} from '@angular/core';
import {ExecuteGraphqlService} from '../../services/execute-graphql.service';
import {Observable, of} from 'rxjs';
import {
  ClvClass,
  CustomerLifetimeValue,
  IdentifiedGuestSegmentation,
  MutationStartProcessArgs,
  Process,
  QueryGetClvClassListArgs,
  QueryGetCustomerLifetimeValueListArgs,
  QueryGetProcessStateArgs,
  QueryGetStatisticArgs,
  QueryGetTotalRecordCountArgs,
  Statistic
} from '../../graphql/generated/graphql';
import {ProcessApis} from './process-api';


@Injectable({
  providedIn: 'root'
})
export class ProcessApisMockService implements ProcessApis {

  constructor(private execute: ExecuteGraphqlService) {
  }


  startProcess(variables: MutationStartProcessArgs): Observable<Process> {
    return of(null);
  }

  getProcessState(variables: QueryGetProcessStateArgs): Observable<Process> {
    return of(null);
  }

  getTotalRecordCount(variables: QueryGetTotalRecordCountArgs): Observable<number> {
    return of(451);
  }

  getCustomerLifetimeValueList(variables: QueryGetCustomerLifetimeValueListArgs): Observable<Array<CustomerLifetimeValue>> {

    return of([{
      firstName: 'Vang',
      lastName: 'Cherry',
      email: 'vangcherry@insource.com',
      ltvClass: 2,
      low: 0.32,
      mid: 0.52,
      high: 0.16,
      type: '1st-Time Guest'
    }, {
      firstName: 'House',
      lastName: 'Sullivan',
      email: 'housesullivan@insource.com',
      ltvClass: 2,
      low: 0.32,
      mid: 0.52,
      high: 0.16,
      type: '1st-Time Guest'
    }, {
      firstName: 'Montgomery',
      lastName: 'Rojas',
      email: 'montgomeryrojas@insource.com',
      ltvClass: 2,
      low: 0.32,
      mid: 0.52,
      high: 0.16,
      type: '1st-Time Guest'
    }, {
      firstName: 'Snider',
      lastName: 'Padilla',
      email: 'sniderpadilla@insource.com',
      ltvClass: 2,
      low: 0.32,
      mid: 0.52,
      high: 0.16,
      type: '1st-Time Guest'
    }, {
      firstName: 'Gale',
      lastName: 'Kirby',
      email: 'galekirby@insource.com',
      ltvClass: 2,
      low: 0.32,
      mid: 0.52,
      high: 0.16,
      type: '1st-Time Guest'
    }, {
      firstName: 'Mclean',
      lastName: 'Gaines',
      email: 'mcleangaines@insource.com',
      ltvClass: 2,
      low: 0.32,
      mid: 0.52,
      high: 0.16,
      type: '1st-Time Guest'
    }, {
      firstName: 'Gray',
      lastName: 'Bright',
      email: 'graybright@insource.com',
      ltvClass: 2,
      low: 0.32,
      mid: 0.52,
      high: 0.16,
      type: '1st-Time Guest'
    }, {
      firstName: 'Carolyn',
      lastName: 'Ortega',
      email: 'carolynortega@insource.com',
      ltvClass: 2,
      low: 0.32,
      mid: 0.52,
      high: 0.16,
      type: '1st-Time Guest'
    }, {
      firstName: 'Patterson',
      lastName: 'Stephens',
      email: 'pattersonstephens@insource.com',
      ltvClass: 2,
      low: 0.32,
      mid: 0.52,
      high: 0.16,
      type: '1st-Time Guest'
    }, {
      firstName: 'Noel',
      lastName: 'Roth',
      email: 'noelroth@insource.com',
      ltvClass: 2,
      low: 0.32,
      mid: 0.52,
      high: 0.16,
      type: '1st-Time Guest'
    }, {
      firstName: 'Stanley',
      lastName: 'Doyle',
      email: 'stanleydoyle@insource.com',
      ltvClass: 2,
      low: 0.32,
      mid: 0.52,
      high: 0.16,
      type: '1st-Time Guest'
    }, {
      firstName: 'Jimmie',
      lastName: 'Aguilar',
      email: 'jimmieaguilar@insource.com',
      ltvClass: 2,
      low: 0.32,
      mid: 0.52,
      high: 0.16,
      type: '1st-Time Guest'
    }, {
      firstName: 'Kent',
      lastName: 'Baker',
      email: 'kentbaker@insource.com',
      ltvClass: 2,
      low: 0.32,
      mid: 0.52,
      high: 0.16,
      type: '1st-Time Guest'
    }, {
      firstName: 'Salas',
      lastName: 'Berg',
      email: 'salasberg@insource.com',
      ltvClass: 2,
      low: 0.32,
      mid: 0.52,
      high: 0.16,
      type: '1st-Time Guest'
    }, {
      firstName: 'Stephanie',
      lastName: 'Jarvis',
      email: 'stephaniejarvis@insource.com',
      ltvClass: 2,
      low: 0.32,
      mid: 0.52,
      high: 0.16,
      type: '1st-Time Guest'
    }, {
      firstName: 'Jeanine',
      lastName: 'Silva',
      email: 'jeaninesilva@insource.com',
      ltvClass: 2,
      low: 0.32,
      mid: 0.52,
      high: 0.16,
      type: '1st-Time Guest'
    }, {
      firstName: 'Christian',
      lastName: 'Walton',
      email: 'christianwalton@insource.com',
      ltvClass: 2,
      low: 0.32,
      mid: 0.52,
      high: 0.16,
      type: '1st-Time Guest'
    }, {
      firstName: 'Sheree',
      lastName: 'Head',
      email: 'shereehead@insource.com',
      ltvClass: 2,
      low: 0.32,
      mid: 0.52,
      high: 0.16,
      type: '1st-Time Guest'
    }, {
      firstName: 'Chris',
      lastName: 'Brooks',
      email: 'chrisbrooks@insource.com',
      ltvClass: 2,
      low: 0.32,
      mid: 0.52,
      high: 0.16,
      type: '1st-Time Guest'
    }, {
      firstName: 'Savage',
      lastName: 'Mcdonald',
      email: 'savagemcdonald@insource.com',
      ltvClass: 2,
      low: 0.32,
      mid: 0.52,
      high: 0.16,
      type: '1st-Time Guest'
    }, {
      firstName: 'Sears',
      lastName: 'Newman',
      email: 'searsnewman@insource.com',
      ltvClass: 2,
      low: 0.32,
      mid: 0.52,
      high: 0.16,
      type: '1st-Time Guest'
    }, {
      firstName: 'Bernadette',
      lastName: 'Daugherty',
      email: 'bernadettedaugherty@insource.com',
      ltvClass: 2,
      low: 0.32,
      mid: 0.52,
      high: 0.16,
      type: '1st-Time Guest'
    }, {
      firstName: 'Dunn',
      lastName: 'Sexton',
      email: 'dunnsexton@insource.com',
      ltvClass: 2,
      low: 0.32,
      mid: 0.52,
      high: 0.16,
      type: '1st-Time Guest'
    }, {
      firstName: 'Foley',
      lastName: 'Swanson',
      email: 'foleyswanson@insource.com',
      ltvClass: 2,
      low: 0.32,
      mid: 0.52,
      high: 0.16,
      type: '1st-Time Guest'
    }, {
      firstName: 'Hutchinson',
      lastName: 'Howe',
      email: 'hutchinsonhowe@insource.com',
      ltvClass: 2,
      low: 0.32,
      mid: 0.52,
      high: 0.16,
      type: '1st-Time Guest'
    }, {
      firstName: 'Ratliff',
      lastName: 'Huffman',
      email: 'ratliffhuffman@insource.com',
      ltvClass: 2,
      low: 0.32,
      mid: 0.52,
      high: 0.16,
      type: '1st-Time Guest'
    }, {
      firstName: 'Briggs',
      lastName: 'Day',
      email: 'briggsday@insource.com',
      ltvClass: 2,
      low: 0.32,
      mid: 0.52,
      high: 0.16,
      type: '1st-Time Guest'
    }, {
      firstName: 'West',
      lastName: 'Albert',
      email: 'westalbert@insource.com',
      ltvClass: 2,
      low: 0.32,
      mid: 0.52,
      high: 0.16,
      type: '1st-Time Guest'
    }, {
      firstName: 'Rae',
      lastName: 'Henderson',
      email: 'raehenderson@insource.com',
      ltvClass: 2,
      low: 0.32,
      mid: 0.52,
      high: 0.16,
      type: '1st-Time Guest'
    }, {
      firstName: 'Lelia',
      lastName: 'Wilkerson',
      email: 'leliawilkerson@insource.com',
      ltvClass: 2,
      low: 0.32,
      mid: 0.52,
      high: 0.16,
      type: '1st-Time Guest'
    }, {
      firstName: 'Simon',
      lastName: 'Cobb',
      email: 'simoncobb@insource.com',
      ltvClass: 2,
      low: 0.32,
      mid: 0.52,
      high: 0.16,
      type: '1st-Time Guest'
    }, {
      firstName: 'Cook',
      lastName: 'Jacobson',
      email: 'cookjacobson@insource.com',
      ltvClass: 2,
      low: 0.32,
      mid: 0.52,
      high: 0.16,
      type: '1st-Time Guest'
    }, {
      firstName: 'Mcintyre',
      lastName: 'Farley',
      email: 'mcintyrefarley@insource.com',
      ltvClass: 2,
      low: 0.32,
      mid: 0.52,
      high: 0.16,
      type: '1st-Time Guest'
    }, {
      firstName: 'Frost',
      lastName: 'Evans',
      email: 'frostevans@insource.com',
      ltvClass: 2,
      low: 0.32,
      mid: 0.52,
      high: 0.16,
      type: '1st-Time Guest'
    }, {
      firstName: 'Wendy',
      lastName: 'Wagner',
      email: 'wendywagner@insource.com',
      ltvClass: 2,
      low: 0.32,
      mid: 0.52,
      high: 0.16,
      type: '1st-Time Guest'
    }, {
      firstName: 'Edwina',
      lastName: 'Bradshaw',
      email: 'edwinabradshaw@insource.com',
      ltvClass: 2,
      low: 0.32,
      mid: 0.52,
      high: 0.16,
      type: '1st-Time Guest'
    }, {
      firstName: 'Emily',
      lastName: 'Chavez',
      email: 'emilychavez@insource.com',
      ltvClass: 2,
      low: 0.32,
      mid: 0.52,
      high: 0.16,
      type: '1st-Time Guest'
    }, {
      firstName: 'Debbie',
      lastName: 'Solis',
      email: 'debbiesolis@insource.com',
      ltvClass: 2,
      low: 0.32,
      mid: 0.52,
      high: 0.16,
      type: '1st-Time Guest'
    }, {
      firstName: 'Jane',
      lastName: 'Vincent',
      email: 'janevincent@insource.com',
      ltvClass: 2,
      low: 0.32,
      mid: 0.52,
      high: 0.16,
      type: '1st-Time Guest'
    }, {
      firstName: 'Stanton',
      lastName: 'Wright',
      email: 'stantonwright@insource.com',
      ltvClass: 2,
      low: 0.32,
      mid: 0.52,
      high: 0.16,
      type: '1st-Time Guest'
    }, {
      firstName: 'Marguerite',
      lastName: 'Moreno',
      email: 'margueritemoreno@insource.com',
      ltvClass: 2,
      low: 0.32,
      mid: 0.52,
      high: 0.16,
      type: '1st-Time Guest'
    }, {
      firstName: 'Ella',
      lastName: 'Bruce',
      email: 'ellabruce@insource.com',
      ltvClass: 2,
      low: 0.32,
      mid: 0.52,
      high: 0.16,
      type: '1st-Time Guest'
    }, {
      firstName: 'Jacobs',
      lastName: 'Zimmerman',
      email: 'jacobszimmerman@insource.com',
      ltvClass: 2,
      low: 0.32,
      mid: 0.52,
      high: 0.16,
      type: '1st-Time Guest'
    }, {
      firstName: 'Hamilton',
      lastName: 'Woods',
      email: 'hamiltonwoods@insource.com',
      ltvClass: 2,
      low: 0.32,
      mid: 0.52,
      high: 0.16,
      type: '1st-Time Guest'
    }, {
      firstName: 'Beulah',
      lastName: 'Wallace',
      email: 'beulahwallace@insource.com',
      ltvClass: 2,
      low: 0.32,
      mid: 0.52,
      high: 0.16,
      type: '1st-Time Guest'
    }, {
      firstName: 'Shepherd',
      lastName: 'Blake',
      email: 'shepherdblake@insource.com',
      ltvClass: 2,
      low: 0.32,
      mid: 0.52,
      high: 0.16,
      type: '1st-Time Guest'
    }, {
      firstName: 'Murray',
      lastName: 'Hayes',
      email: 'murrayhayes@insource.com',
      ltvClass: 2,
      low: 0.32,
      mid: 0.52,
      high: 0.16,
      type: '1st-Time Guest'
    }, {
      firstName: 'Ruby',
      lastName: 'Holden',
      email: 'rubyholden@insource.com',
      ltvClass: 2,
      low: 0.32,
      mid: 0.52,
      high: 0.16,
      type: '1st-Time Guest'
    }, {
      firstName: 'Lorraine',
      lastName: 'Garcia',
      email: 'lorrainegarcia@insource.com',
      ltvClass: 2,
      low: 0.32,
      mid: 0.52,
      high: 0.16,
      type: '1st-Time Guest'
    }, {
      firstName: 'Helen',
      lastName: 'Waller',
      email: 'helenwaller@insource.com',
      ltvClass: 2,
      low: 0.32,
      mid: 0.52,
      high: 0.16,
      type: '1st-Time Guest'
    }, {
      firstName: 'Simone',
      lastName: 'Henson',
      email: 'simonehenson@insource.com',
      ltvClass: 2,
      low: 0.32,
      mid: 0.52,
      high: 0.16,
      type: '1st-Time Guest'
    }, {
      firstName: 'Graham',
      lastName: 'Mcclain',
      email: 'grahammcclain@insource.com',
      ltvClass: 2,
      low: 0.32,
      mid: 0.52,
      high: 0.16,
      type: '1st-Time Guest'
    }, {
      firstName: 'Wilkins',
      lastName: 'Young',
      email: 'wilkinsyoung@insource.com',
      ltvClass: 2,
      low: 0.32,
      mid: 0.52,
      high: 0.16,
      type: '1st-Time Guest'
    }, {
      firstName: 'Johnston',
      lastName: 'Hull',
      email: 'johnstonhull@insource.com',
      ltvClass: 2,
      low: 0.32,
      mid: 0.52,
      high: 0.16,
      type: '1st-Time Guest'
    }, {
      firstName: 'Elena',
      lastName: 'Ewing',
      email: 'elenaewing@insource.com',
      ltvClass: 2,
      low: 0.32,
      mid: 0.52,
      high: 0.16,
      type: '1st-Time Guest'
    }, {
      firstName: 'Taylor',
      lastName: 'Pearson',
      email: 'taylorpearson@insource.com',
      ltvClass: 2,
      low: 0.32,
      mid: 0.52,
      high: 0.16,
      type: '1st-Time Guest'
    }, {
      firstName: 'Hampton',
      lastName: 'Barrera',
      email: 'hamptonbarrera@insource.com',
      ltvClass: 2,
      low: 0.32,
      mid: 0.52,
      high: 0.16,
      type: '1st-Time Guest'
    }, {
      firstName: 'Thelma',
      lastName: 'Zamora',
      email: 'thelmazamora@insource.com',
      ltvClass: 2,
      low: 0.32,
      mid: 0.52,
      high: 0.16,
      type: '1st-Time Guest'
    }, {
      firstName: 'Lacey',
      lastName: 'Randall',
      email: 'laceyrandall@insource.com',
      ltvClass: 2,
      low: 0.32,
      mid: 0.52,
      high: 0.16,
      type: '1st-Time Guest'
    }, {
      firstName: 'Mcclain',
      lastName: 'Rogers',
      email: 'mcclainrogers@insource.com',
      ltvClass: 2,
      low: 0.32,
      mid: 0.52,
      high: 0.16,
      type: '1st-Time Guest'
    }, {
      firstName: 'Rose',
      lastName: 'Robbins',
      email: 'roserobbins@insource.com',
      ltvClass: 2,
      low: 0.32,
      mid: 0.52,
      high: 0.16,
      type: '1st-Time Guest'
    }, {
      firstName: 'Bryan',
      lastName: 'Ramirez',
      email: 'bryanramirez@insource.com',
      ltvClass: 2,
      low: 0.32,
      mid: 0.52,
      high: 0.16,
      type: '1st-Time Guest'
    }, {
      firstName: 'Hensley',
      lastName: 'Gilmore',
      email: 'hensleygilmore@insource.com',
      ltvClass: 2,
      low: 0.32,
      mid: 0.52,
      high: 0.16,
      type: '1st-Time Guest'
    }, {
      firstName: 'Webb',
      lastName: 'Cross',
      email: 'webbcross@insource.com',
      ltvClass: 2,
      low: 0.32,
      mid: 0.52,
      high: 0.16,
      type: '1st-Time Guest'
    }, {
      firstName: 'Holloway',
      lastName: 'Conner',
      email: 'hollowayconner@insource.com',
      ltvClass: 2,
      low: 0.32,
      mid: 0.52,
      high: 0.16,
      type: '1st-Time Guest'
    }, {
      firstName: 'Shelley',
      lastName: 'Hebert',
      email: 'shelleyhebert@insource.com',
      ltvClass: 2,
      low: 0.32,
      mid: 0.52,
      high: 0.16,
      type: '1st-Time Guest'
    }, {
      firstName: 'Burnett',
      lastName: 'Schwartz',
      email: 'burnettschwartz@insource.com',
      ltvClass: 2,
      low: 0.32,
      mid: 0.52,
      high: 0.16,
      type: '1st-Time Guest'
    }, {
      firstName: 'Glenda',
      lastName: 'Sawyer',
      email: 'glendasawyer@insource.com',
      ltvClass: 2,
      low: 0.32,
      mid: 0.52,
      high: 0.16,
      type: '1st-Time Guest'
    }, {
      firstName: 'Rodgers',
      lastName: 'Norman',
      email: 'rodgersnorman@insource.com',
      ltvClass: 2,
      low: 0.32,
      mid: 0.52,
      high: 0.16,
      type: '1st-Time Guest'
    }, {
      firstName: 'Fanny',
      lastName: 'Black',
      email: 'fannyblack@insource.com',
      ltvClass: 2,
      low: 0.32,
      mid: 0.52,
      high: 0.16,
      type: '1st-Time Guest'
    }, {
      firstName: 'Judy',
      lastName: 'Alston',
      email: 'judyalston@insource.com',
      ltvClass: 2,
      low: 0.32,
      mid: 0.52,
      high: 0.16,
      type: '1st-Time Guest'
    }, {
      firstName: 'Pugh',
      lastName: 'Ellison',
      email: 'pughellison@insource.com',
      ltvClass: 2,
      low: 0.32,
      mid: 0.52,
      high: 0.16,
      type: '1st-Time Guest'
    }, {
      firstName: 'Montoya',
      lastName: 'Webster',
      email: 'montoyawebster@insource.com',
      ltvClass: 2,
      low: 0.32,
      mid: 0.52,
      high: 0.16,
      type: '1st-Time Guest'
    }, {
      firstName: 'Schneider',
      lastName: 'Ortiz',
      email: 'schneiderortiz@insource.com',
      ltvClass: 2,
      low: 0.32,
      mid: 0.52,
      high: 0.16,
      type: '1st-Time Guest'
    }, {
      firstName: 'Dollie',
      lastName: 'Gamble',
      email: 'dolliegamble@insource.com',
      ltvClass: 2,
      low: 0.32,
      mid: 0.52,
      high: 0.16,
      type: '1st-Time Guest'
    }, {
      firstName: 'Riggs',
      lastName: 'Nolan',
      email: 'riggsnolan@insource.com',
      ltvClass: 2,
      low: 0.32,
      mid: 0.52,
      high: 0.16,
      type: '1st-Time Guest'
    }, {
      firstName: 'Donna',
      lastName: 'Clarke',
      email: 'donnaclarke@insource.com',
      ltvClass: 2,
      low: 0.32,
      mid: 0.52,
      high: 0.16,
      type: '1st-Time Guest'
    }, {
      firstName: 'Dawson',
      lastName: 'Leach',
      email: 'dawsonleach@insource.com',
      ltvClass: 2,
      low: 0.32,
      mid: 0.52,
      high: 0.16,
      type: '1st-Time Guest'
    }, {
      firstName: 'Deann',
      lastName: 'Hines',
      email: 'deannhines@insource.com',
      ltvClass: 2,
      low: 0.32,
      mid: 0.52,
      high: 0.16,
      type: '1st-Time Guest'
    }, {
      firstName: 'Eaton',
      lastName: 'Howell',
      email: 'eatonhowell@insource.com',
      ltvClass: 2,
      low: 0.32,
      mid: 0.52,
      high: 0.16,
      type: '1st-Time Guest'
    }, {
      firstName: 'Clark',
      lastName: 'Coleman',
      email: 'clarkcoleman@insource.com',
      ltvClass: 2,
      low: 0.32,
      mid: 0.52,
      high: 0.16,
      type: '1st-Time Guest'
    }, {
      firstName: 'Luann',
      lastName: 'Pierce',
      email: 'luannpierce@insource.com',
      ltvClass: 2,
      low: 0.32,
      mid: 0.52,
      high: 0.16,
      type: '1st-Time Guest'
    }, {
      firstName: 'Sharp',
      lastName: 'Villarreal',
      email: 'sharpvillarreal@insource.com',
      ltvClass: 2,
      low: 0.32,
      mid: 0.52,
      high: 0.16,
      type: '1st-Time Guest'
    }, {
      firstName: 'Henrietta',
      lastName: 'Hunt',
      email: 'henriettahunt@insource.com',
      ltvClass: 2,
      low: 0.32,
      mid: 0.52,
      high: 0.16,
      type: '1st-Time Guest'
    }, {
      firstName: 'Rosemarie',
      lastName: 'Fulton',
      email: 'rosemariefulton@insource.com',
      ltvClass: 2,
      low: 0.32,
      mid: 0.52,
      high: 0.16,
      type: '1st-Time Guest'
    }, {
      firstName: 'Josefa',
      lastName: 'Salinas',
      email: 'josefasalinas@insource.com',
      ltvClass: 2,
      low: 0.32,
      mid: 0.52,
      high: 0.16,
      type: '1st-Time Guest'
    }, {
      firstName: 'Desiree',
      lastName: 'Tate',
      email: 'desireetate@insource.com',
      ltvClass: 2,
      low: 0.32,
      mid: 0.52,
      high: 0.16,
      type: '1st-Time Guest'
    }, {
      firstName: 'Merle',
      lastName: 'Melton',
      email: 'merlemelton@insource.com',
      ltvClass: 2,
      low: 0.32,
      mid: 0.52,
      high: 0.16,
      type: '1st-Time Guest'
    }, {
      firstName: 'Faith',
      lastName: 'Dodson',
      email: 'faithdodson@insource.com',
      ltvClass: 2,
      low: 0.32,
      mid: 0.52,
      high: 0.16,
      type: '1st-Time Guest'
    }, {
      firstName: 'Velazquez',
      lastName: 'Terry',
      email: 'velazquezterry@insource.com',
      ltvClass: 2,
      low: 0.32,
      mid: 0.52,
      high: 0.16,
      type: '1st-Time Guest'
    }, {
      firstName: 'Deloris',
      lastName: 'Vaughan',
      email: 'delorisvaughan@insource.com',
      ltvClass: 1,
      low: 1,
      mid: 0,
      high: 0,
      type: 'Returning Guest'
    }, {
      firstName: 'Amelia',
      lastName: 'Wolf',
      email: 'ameliawolf@insource.com',
      ltvClass: 1,
      low: 1,
      mid: 0,
      high: 0,
      type: 'Returning Guest'
    }, {
      firstName: 'Mullins',
      lastName: 'Watts',
      email: 'mullinswatts@insource.com',
      ltvClass: 2,
      low: 0.32,
      mid: 0.52,
      high: 0.16,
      type: '1st-Time Guest'
    }, {
      firstName: 'Frederick',
      lastName: 'Higgins',
      email: 'frederickhiggins@insource.com',
      ltvClass: 2,
      low: 0.32,
      mid: 0.52,
      high: 0.16,
      type: '1st-Time Guest'
    }, {
      firstName: 'Adrian',
      lastName: 'Morse',
      email: 'adrianmorse@insource.com',
      ltvClass: 3,
      low: 0,
      mid: 0,
      high: 1,
      type: 'Returning Guest'
    }, {
      firstName: 'Gillespie',
      lastName: 'Santana',
      email: 'gillespiesantana@insource.com',
      ltvClass: 2,
      low: 0.32,
      mid: 0.52,
      high: 0.16,
      type: '1st-Time Guest'
    }, {
      firstName: 'Faulkner',
      lastName: 'Bryant',
      email: 'faulknerbryant@insource.com',
      ltvClass: 1,
      low: 1,
      mid: 0,
      high: 0,
      type: 'Returning Guest'
    }, {
      firstName: 'Duke',
      lastName: 'Mcdaniel',
      email: 'dukemcdaniel@insource.com',
      ltvClass: 2,
      low: 0.32,
      mid: 0.52,
      high: 0.16,
      type: '1st-Time Guest'
    }, {
      firstName: 'Bright',
      lastName: 'Lester',
      email: 'brightlester@insource.com',
      ltvClass: 1,
      low: 1,
      mid: 0,
      high: 0,
      type: 'Returning Guest'
    }, {
      firstName: 'Dana',
      lastName: 'Booker',
      email: 'danabooker@insource.com',
      ltvClass: 2,
      low: 0.32,
      mid: 0.52,
      high: 0.16,
      type: '1st-Time Guest'
    }, {
      firstName: 'Susanne',
      lastName: 'Lowery',
      email: 'susannelowery@insource.com',
      ltvClass: 2,
      low: 0.32,
      mid: 0.52,
      high: 0.16,
      type: '1st-Time Guest'
    }, {
      firstName: 'Lina',
      lastName: 'Weeks',
      email: 'linaweeks@insource.com',
      ltvClass: 1,
      low: 1,
      mid: 0,
      high: 0,
      type: 'Returning Guest'
    }, {
      firstName: 'Earline',
      lastName: 'Cervantes',
      email: 'earlinecervantes@insource.com',
      ltvClass: 2,
      low: 0.32,
      mid: 0.52,
      high: 0.16,
      type: '1st-Time Guest'
    }, {
      firstName: 'Marion',
      lastName: 'Ayers',
      email: 'marionayers@insource.com',
      ltvClass: 2,
      low: 0.32,
      mid: 0.52,
      high: 0.16,
      type: '1st-Time Guest'
    }, {
      firstName: 'Lenore',
      lastName: 'Petty',
      email: 'lenorepetty@insource.com',
      ltvClass: 2,
      low: 0.32,
      mid: 0.52,
      high: 0.16,
      type: '1st-Time Guest'
    }, {
      firstName: 'Katelyn',
      lastName: 'Lynn',
      email: 'katelynlynn@insource.com',
      ltvClass: 2,
      low: 0.32,
      mid: 0.52,
      high: 0.16,
      type: '1st-Time Guest'
    }, {
      firstName: 'Le',
      lastName: 'Chang',
      email: 'lechang@insource.com',
      ltvClass: 2,
      low: 0.32,
      mid: 0.52,
      high: 0.16,
      type: '1st-Time Guest'
    }, {
      firstName: 'Evelyn',
      lastName: 'Sharpe',
      email: 'evelynsharpe@insource.com',
      ltvClass: 2,
      low: 0.32,
      mid: 0.52,
      high: 0.16,
      type: '1st-Time Guest'
    }, {
      firstName: 'Adrienne',
      lastName: 'Glover',
      email: 'adrienneglover@insource.com',
      ltvClass: 2,
      low: 0.32,
      mid: 0.52,
      high: 0.16,
      type: '1st-Time Guest'
    }, {
      firstName: 'Marcella',
      lastName: 'Wise',
      email: 'marcellawise@insource.com',
      ltvClass: 1,
      low: 1,
      mid: 0,
      high: 0,
      type: 'Returning Guest'
    }, {
      firstName: 'Wells',
      lastName: 'Dale',
      email: 'wellsdale@insource.com',
      ltvClass: 2,
      low: 0.32,
      mid: 0.52,
      high: 0.16,
      type: '1st-Time Guest'
    }, {
      firstName: 'Roberts',
      lastName: 'Mays',
      email: 'robertsmays@insource.com',
      ltvClass: 2,
      low: 0.32,
      mid: 0.52,
      high: 0.16,
      type: '1st-Time Guest'
    }, {
      firstName: 'Hopper',
      lastName: 'Robinson',
      email: 'hopperrobinson@insource.com',
      ltvClass: 2,
      low: 0.32,
      mid: 0.52,
      high: 0.16,
      type: '1st-Time Guest'
    }, {
      firstName: 'Belinda',
      lastName: 'Daniels',
      email: 'belindadaniels@insource.com',
      ltvClass: 2,
      low: 0.32,
      mid: 0.52,
      high: 0.16,
      type: '1st-Time Guest'
    }, {
      firstName: 'Miriam',
      lastName: 'Roman',
      email: 'miriamroman@insource.com',
      ltvClass: 2,
      low: 0.32,
      mid: 0.52,
      high: 0.16,
      type: '1st-Time Guest'
    }, {
      firstName: 'Marisa',
      lastName: 'Gomez',
      email: 'marisagomez@insource.com',
      ltvClass: 2,
      low: 0.32,
      mid: 0.52,
      high: 0.16,
      type: '1st-Time Guest'
    }, {
      firstName: 'Lourdes',
      lastName: 'Mcmahon',
      email: 'lourdesmcmahon@insource.com',
      ltvClass: 1,
      low: 1,
      mid: 0,
      high: 0,
      type: 'Returning Guest'
    }, {
      firstName: 'Johns',
      lastName: 'Ellis',
      email: 'johnsellis@insource.com',
      ltvClass: 2,
      low: 0.32,
      mid: 0.52,
      high: 0.16,
      type: '1st-Time Guest'
    }, {
      firstName: 'Sharron',
      lastName: 'Stewart',
      email: 'sharronstewart@insource.com',
      ltvClass: 2,
      low: 0.32,
      mid: 0.52,
      high: 0.16,
      type: '1st-Time Guest'
    }, {
      firstName: 'Paulette',
      lastName: 'Talley',
      email: 'paulettetalley@insource.com',
      ltvClass: 1,
      low: 1,
      mid: 0,
      high: 0,
      type: 'Returning Guest'
    }, {
      firstName: 'Caroline',
      lastName: 'Hamilton',
      email: 'carolinehamilton@insource.com',
      ltvClass: 2,
      low: 0.32,
      mid: 0.52,
      high: 0.16,
      type: '1st-Time Guest'
    }, {
      firstName: 'Maria',
      lastName: 'Griffin',
      email: 'mariagriffin@insource.com',
      ltvClass: 2,
      low: 0,
      mid: 1,
      high: 0,
      type: 'Returning Guest'
    }, {
      firstName: 'Schwartz',
      lastName: 'Branch',
      email: 'schwartzbranch@insource.com',
      ltvClass: 2,
      low: 0.32,
      mid: 0.52,
      high: 0.16,
      type: '1st-Time Guest'
    }, {
      firstName: 'Melisa',
      lastName: 'Beasley',
      email: 'melisabeasley@insource.com',
      ltvClass: 2,
      low: 0.32,
      mid: 0.52,
      high: 0.16,
      type: '1st-Time Guest'
    }, {
      firstName: 'Lola',
      lastName: 'Delacruz',
      email: 'loladelacruz@insource.com',
      ltvClass: 2,
      low: 0.32,
      mid: 0.52,
      high: 0.16,
      type: '1st-Time Guest'
    }, {
      firstName: 'Goodwin',
      lastName: 'Chaney',
      email: 'goodwinchaney@insource.com',
      ltvClass: 2,
      low: 0,
      mid: 1,
      high: 0,
      type: 'Returning Guest'
    }, {
      firstName: 'Sofia',
      lastName: 'Callahan',
      email: 'sofiacallahan@insource.com',
      ltvClass: 2,
      low: 0.32,
      mid: 0.52,
      high: 0.16,
      type: '1st-Time Guest'
    }, {
      firstName: 'Osborn',
      lastName: 'Diaz',
      email: 'osborndiaz@insource.com',
      ltvClass: 2,
      low: 0,
      mid: 1,
      high: 0,
      type: 'Returning Guest'
    }, {
      firstName: 'Tamera',
      lastName: 'Cox',
      email: 'tameracox@insource.com',
      ltvClass: 2,
      low: 0.32,
      mid: 0.52,
      high: 0.16,
      type: '1st-Time Guest'
    }, {
      firstName: 'Tracey',
      lastName: 'Sykes',
      email: 'traceysykes@insource.com',
      ltvClass: 2,
      low: 0.32,
      mid: 0.52,
      high: 0.16,
      type: '1st-Time Guest'
    }, {
      firstName: 'Marks',
      lastName: 'Hunter',
      email: 'markshunter@insource.com',
      ltvClass: 2,
      low: 0.32,
      mid: 0.52,
      high: 0.16,
      type: '1st-Time Guest'
    }, {
      firstName: 'Stuart',
      lastName: 'Sweet',
      email: 'stuartsweet@insource.com',
      ltvClass: 2,
      low: 0,
      mid: 1,
      high: 0,
      type: 'Returning Guest'
    }, {
      firstName: 'Nelson',
      lastName: 'Irwin',
      email: 'nelsonirwin@insource.com',
      ltvClass: 2,
      low: 0.32,
      mid: 0.52,
      high: 0.16,
      type: '1st-Time Guest'
    }, {
      firstName: 'Shepard',
      lastName: 'Solomon',
      email: 'shepardsolomon@insource.com',
      ltvClass: 2,
      low: 0.32,
      mid: 0.52,
      high: 0.16,
      type: '1st-Time Guest'
    }, {
      firstName: 'Garza',
      lastName: 'Stein',
      email: 'garzastein@insource.com',
      ltvClass: 2,
      low: 0.32,
      mid: 0.52,
      high: 0.16,
      type: '1st-Time Guest'
    }]);
  }

  getClvClassList(variables: QueryGetClvClassListArgs): Observable<Array<ClvClass>> {
    return of([{
      name: 'Low',
      typeList: [{name: '1st-Time Guest', value: 0}, {name: 'Returning Guest', value: 8}]
    }, {
      name: 'Medium',
      typeList: [{name: '1st-Time Guest', value: 122}, {name: 'Returning Guest', value: 4}]
    }, {
      name: 'High',
      typeList: [{name: '1st-Time Guest', value: 0}, {name: 'Returning Guest', value: 1}]
    }]);
  }

  getIdentifiedGuestSegmentation(variables: QueryGetCustomerLifetimeValueListArgs): Observable<Array<IdentifiedGuestSegmentation>> {
    return of([
      {
        segment: 'Returning Guest', value: 0.0962962962962963
      }, {
        segment: '1st-Time Guest',
        value: 0.9037037037037037
      }
    ]);
  }

  getStatistic(variables: QueryGetStatisticArgs): Observable<Statistic> {
    return of({totalIdentifiedGuest: 135, totalPotentialVipGuest: 0, highValueGuest: 1});
  }

}
