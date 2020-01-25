/*
 * Definitions:
 * https://assets.publishing.service.gov.uk/government/uploads/system/uploads/attachment_data/file/743853/reported-road-casualties-gb-notes-definitions.pdf
 *
 * Fatal accident: An accident in which at least one person is killed.
 *
 * Serious injury: An injury for which a person is detained in hospital as an “in-patient”, or any of the following
 * injuries whether or not they are detained in hospital: fractures, concussion, internal injuries, crushings, burns
 * (excluding friction burns), severe cuts, severe general shock requiring medical treatment and injuries causing
 * death 30 or more days after the accident. An injured casualty is recorded as seriously or slightly injured by the
 * police on the basis of information available within a short time of the accident. This generally will not reflect the
 * results of a medical examination, but may be influenced according to whether the casualty is hospitalised or not.
 * Hospitalisation procedures will vary regionally.
 *
 * Slight injury: An injury of a minor character such as a sprain (including neck whiplash injury), bruise or cut which
 * are not judged to be severe, or slight shock requiring roadside attention. This definition includes injuries not
 * requiring medical treatment.
 *
 * Stats are found in RAS30066 from:
 * https://www.gov.uk/government/statistical-data-sets/ras30-reported-casualties-in-road-accidents
 *
 * 2018 statistics from RAS30066:
 */
const fatalities = 354
const seriousInjuries = 5497
const slightInjuries = 10967

// Estimated 2.74 billion miles travelled by motorcycles on UK roads
const statsPerGivenMiles = miles => stats => (miles * stats / 2740000000).toFixed(5)

// Major milestones worth thinking about the safety of:
const mileagesToCheck = [
       5000, // So far I believe I have covered roughly this much
      10000, // I aim to cover this per year, excluding serious excursions
     100000, // 10 years
    1000000, // Lifetime maximum with lots of serious excursions
]

mileagesToCheck.forEach(miles => {
    const statsForMiles = statsPerGivenMiles(miles)
    console.log(`Accident type per ${ miles.toLocaleString() } miles:`)
    console.log(`  fatal:   ${ statsForMiles(fatalities) }`)
    console.log(`  serious: ${ statsForMiles(seriousInjuries) }`)
    console.log(`  slight:  ${ statsForMiles(slightInjuries) }`)
})
