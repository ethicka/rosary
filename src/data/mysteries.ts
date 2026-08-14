// The 20 Mysteries of the Rosary. Titles, Scripture text/references, and fruits are
// copied verbatim from https://www.usccb.org/how-to-pray-the-rosary

export type MysterySetName = "Joyful" | "Sorrowful" | "Glorious" | "Luminous";

export interface Mystery {
  set: MysterySetName;
  order: 1 | 2 | 3 | 4 | 5;
  title: string;
  scripture_ref: string;
  scripture_text: string;
  fruit: string;
}

export const MYSTERY_SETS: MysterySetName[] = [
  "Joyful",
  "Sorrowful",
  "Glorious",
  "Luminous",
];

export const MYSTERY_SET_TAGLINE: Record<MysterySetName, string> = {
  Joyful: "The Incarnation and hidden life of Christ",
  Sorrowful: "The Passion and Death of Christ",
  Glorious: "The Resurrection and glory of Christ",
  Luminous: "The public ministry of Christ",
};

export const MYSTERIES: Mystery[] = [
  // Joyful
  {
    set: "Joyful",
    order: 1,
    title: "The Annunciation",
    scripture_ref: "Luke 1:26-27",
    scripture_text:
      "In the sixth month, the angel Gabriel was sent from God to a town of Galilee called Nazareth, to a virgin betrothed to a man named Joseph, of the house of David, and the virgin's name was Mary.",
    fruit: "Humility",
  },
  {
    set: "Joyful",
    order: 2,
    title: "The Visitation",
    scripture_ref: "Luke 1:39-42",
    scripture_text:
      "During those days Mary set out and traveled to the hill country in haste to a town of Judah, where she entered the house of Zechariah and greeted Elizabeth. When Elizabeth heard Mary's greeting, the infant leaped in her womb, and Elizabeth, filled with the holy Spirit, cried out in a loud voice and said, 'Most blessed are you among women, and blessed is the fruit of your womb.'",
    fruit: "Love of Neighbor",
  },
  {
    set: "Joyful",
    order: 3,
    title: "The Nativity",
    scripture_ref: "Luke 2:1-7",
    scripture_text:
      "In those days a decree went out from Caesar Augustus that the whole world should be enrolled. This was the first enrollment, when Quirinius was governor of Syria. So all went to be enrolled, each to his own town. And Joseph too went up from Galilee from the town of Nazareth to Judea, to the city of David that is called Bethlehem, because he was of the house and family of David, to be enrolled with Mary, his betrothed, who was with child. While they were there, the time came for her to have her child, and she gave birth to her firstborn son. She wrapped him in swaddling clothes and laid him in a manger, because there was no room for them in the inn.",
    fruit: "Poverty",
  },
  {
    set: "Joyful",
    order: 4,
    title: "The Presentation in the Temple",
    scripture_ref: "Luke 2:21-24",
    scripture_text:
      "When eight days were completed for his circumcision, he was named Jesus, the name given him by the angel before he was conceived in the womb. When the days were completed for their purification according to the law of Moses, they took him up to Jerusalem to present him to the Lord, just as it is written in the law of the Lord, 'Every male that opens the womb shall be consecrated to the Lord,' and to offer the sacrifice of 'a pair of turtledoves or two young pigeons,' in accordance with the dictate in the law of the Lord.",
    fruit: "Purity of Heart and Body",
  },
  {
    set: "Joyful",
    order: 5,
    title: "The Finding in the Temple",
    scripture_ref: "Luke 2:41-47",
    scripture_text:
      "Each year his parents went to Jerusalem for the feast of Passover, and when he was twelve years old, they went up according to festival custom. After they had completed its days, as they were returning, the boy Jesus remained behind in Jerusalem, but his parents did not know it. Thinking that he was in the caravan, they journeyed for a day and looked for him among their relatives and acquaintances, but not finding him, they returned to Jerusalem to look for him. After three days they found him in the temple, sitting in the midst of the teachers, listening to them and asking them questions, and all who heard him were astounded at his understanding and his answers.",
    fruit: "Devotion to Jesus",
  },
  // Sorrowful
  {
    set: "Sorrowful",
    order: 1,
    title: "The Agony in the Garden",
    scripture_ref: "Matthew 26:36-39",
    scripture_text:
      "Then Jesus came with them to a place called Gethsemane, and he said to his disciples, 'Sit here while I go over there and pray.' He took along Peter and the two sons of Zebedee, and began to feel sorrow and distress. Then he said to them, 'My soul is sorrowful even to death. Remain here and keep watch with me.' He advanced a little and fell prostrate in prayer, saying, 'My Father, if it is possible, let this cup pass from me; yet, not as I will, but as you will.'",
    fruit: "Obedience to God's Will",
  },
  {
    set: "Sorrowful",
    order: 2,
    title: "The Scourging at the Pillar",
    scripture_ref: "Matthew 27:26",
    scripture_text:
      "Then he released Barabbas to them, but after he had Jesus scourged, he handed him over to be crucified.",
    fruit: "Mortification",
  },
  {
    set: "Sorrowful",
    order: 3,
    title: "The Crowning with Thorns",
    scripture_ref: "Matthew 27:27-29",
    scripture_text:
      "Then the soldiers of the governor took Jesus inside the praetorium and gathered the whole cohort around him. They stripped off his clothes and threw a scarlet military cloak about him. Weaving a crown out of thorns, they placed it on his head, and a reed in his right hand. And kneeling before him, they mocked him, saying, 'Hail, King of the Jews!'",
    fruit: "Courage",
  },
  {
    set: "Sorrowful",
    order: 4,
    title: "The Carrying of the Cross",
    scripture_ref: "Mark 15:21-22",
    scripture_text:
      "They pressed into service a passer-by, Simon, a Cyrenian, who was coming in from the country, the father of Alexander and Rufus, to carry his cross. They brought him to the place of Golgotha (which is translated Place of the Skull).",
    fruit: "Patience",
  },
  {
    set: "Sorrowful",
    order: 5,
    title: "The Crucifixion and Death",
    scripture_ref: "Luke 23:33-46",
    scripture_text:
      "When they came to the place called the Skull, they crucified him and the criminals there, one on his right, the other on his left. Then Jesus said, 'Father, forgive them, they know not what they do.' They divided his garments by casting lots. The people stood by and watched; the rulers, meanwhile, sneered at him and said, 'He saved others, let him save himself if he is the chosen one, the Messiah of God.' Even the soldiers jeered at him. As they approached to offer him wine they called out, 'If you are King of the Jews, save yourself.' Above him there was an inscription that read, 'This is the King of the Jews.' Now one of the criminals hanging there reviled Jesus, saying, 'Are you not the Messiah? Save yourself and us.' The other, however, rebuking him, said in reply, 'Have you no fear of God, for you are subject to the same condemnation? And indeed, we have been condemned justly, for the sentence we received corresponds to our crimes, but this man has done nothing criminal.' Then he said, 'Jesus, remember me when you come into your kingdom.' He replied to him, 'Amen, I say to you, today you will be with me in Paradise.' It was now about noon and darkness came over the whole land until three in the afternoon because of an eclipse of the sun. Then the veil of the temple was torn down the middle. Jesus cried out in a loud voice, 'Father, into your hands I commend my spirit'; and when he had said this he breathed his last.",
    fruit: "Sorrow for our Sins",
  },
  // Glorious
  {
    set: "Glorious",
    order: 1,
    title: "The Resurrection",
    scripture_ref: "Luke 24:1-5",
    scripture_text:
      "But at daybreak on the first day of the week they took the spices they had prepared and went to the tomb. They found the stone rolled away from the tomb; but when they entered, they did not find the body of the Lord Jesus. While they were puzzling over this, behold, two men in dazzling garments appeared to them. They were terrified and bowed their faces to the ground. They said to them, 'Why do you seek the living one among the dead? He is not here, but he has been raised.'",
    fruit: "Faith",
  },
  {
    set: "Glorious",
    order: 2,
    title: "The Ascension",
    scripture_ref: "Mark 16:19",
    scripture_text:
      "So then the Lord Jesus, after he spoke to them, was taken up into heaven and took his seat at the right hand of God.",
    fruit: "Hope",
  },
  {
    set: "Glorious",
    order: 3,
    title: "The Descent of the Holy Spirit",
    scripture_ref: "Acts 2:1-4",
    scripture_text:
      "When the time for Pentecost was fulfilled, they were all in one place together. And suddenly there came from the sky a noise like a strong driving wind, and it filled the entire house in which they were. Then there appeared to them tongues as of fire, which parted and came to rest on each one of them. And they were all filled with the holy Spirit and began to speak in different tongues, as the Spirit enabled them to proclaim.",
    fruit: "Wisdom",
  },
  {
    set: "Glorious",
    order: 4,
    title: "The Assumption",
    scripture_ref: "Luke 1:48-49",
    scripture_text:
      "Behold, from now on will all ages call me blessed. The Mighty One has done great things for me, and holy is his name.",
    fruit: "Devotion to Mary",
  },
  {
    set: "Glorious",
    order: 5,
    title: "The Coronation of Mary",
    scripture_ref: "Revelation 12:1",
    scripture_text:
      "A great sign appeared in the sky, a woman clothed with the sun, with the moon under her feet, and on her head a crown of twelve stars.",
    fruit: "Grace of a happy death",
  },
  // Luminous
  {
    set: "Luminous",
    order: 1,
    title: "The Baptism of Christ in the Jordan",
    scripture_ref: "Matthew 3:16-17",
    scripture_text:
      "After Jesus was baptized, he came up from the water and behold, the heavens were opened for him, and he saw the Spirit of God descending like a dove and coming upon him. And a voice came from the heavens, saying, 'This is my beloved Son, with whom I am well pleased.'",
    fruit: "Openness to the Holy Spirit",
  },
  {
    set: "Luminous",
    order: 2,
    title: "The Wedding Feast at Cana",
    scripture_ref: "John 2:1-5",
    scripture_text:
      "On the third day there was a wedding in Cana in Galilee, and the mother of Jesus was there. Jesus and his disciples were also invited to the wedding. When the wine ran short, the mother of Jesus said to him, 'They have no wine.' Jesus said to her, 'Woman, how does your concern affect me? My hour has not yet come.' His mother said to the servers, 'Do whatever he tells you.'",
    fruit: "To Jesus through Mary",
  },
  {
    set: "Luminous",
    order: 3,
    title: "The Proclamation of the Kingdom",
    scripture_ref: "Mark 1:15",
    scripture_text:
      "'This is the time of fulfillment. The kingdom of God is at hand. Repent, and believe in the gospel.'",
    fruit: "Conversion",
  },
  {
    set: "Luminous",
    order: 4,
    title: "The Transfiguration",
    scripture_ref: "Matthew 17:1-2",
    scripture_text:
      "After six days Jesus took Peter, James, and John his brother, and led them up a high mountain by themselves. And he was transfigured before them; his face shone like the sun and his clothes became white as light.",
    fruit: "Desire for holiness",
  },
  {
    set: "Luminous",
    order: 5,
    title: "The Institution of the Eucharist",
    scripture_ref: "Matthew 26:26",
    scripture_text:
      "While they were eating, Jesus took bread, said the blessing, broke it, and giving it to his disciples said, 'Take and eat; this is my body.'",
    fruit: "Adoration",
  },
];

export function getMysterySet(set: MysterySetName): Mystery[] {
  return MYSTERIES.filter((m) => m.set === set).sort((a, b) => a.order - b.order);
}
