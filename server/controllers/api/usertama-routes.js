const router = require('express').Router();
const { UserTama,  Tama, User} = require('../../models')
const { authMiddleware } = require('../../utils/auth')
//URL: <homeURL>/api/usertama

//ALL USER ALL TAMAS
router.get('/', async (req, res) => {
  try {
    const dbUserTamaData = await User.findAll({
      include:
      [
        // {all: true, nested: true},
        { as: "tamas_owned",
        model: Tama,
        through: {
          attributes: {exclude: ['user_id', 'tama_id']} // | Will only include tama attributes (age, hunger, etc.) |
        }},
      ]
    })

    const UserTamaData = dbUserTamaData.map((usertama) => usertama.get({ plain: true }))

    res.status(200).json(UserTamaData)

  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
})
//ONE USER ALL TAMAS (FE API: getUser(user_id, token))
router.get('/:u_id', authMiddleware, async (req, res) => {
  console.log('the idddddd--------------------------->', req.params.u_id)
  try {
    // const dbUserTamaData = await User.findByPk(req.params.u_id)
    const dbUserTamaData = await User.findByPk(req.params.u_id,
    {
      include:
      [
        // {all: true, nested: true}
        { as: "tamas_owned",
        model: Tama,
        through: {
          attributes: {exclude: ['user_id', 'tama_id']} // | Will only include tama attributes (age, hunger, etc.) |
        }},
      ]
    })

    if (!dbUserTamaData) {
      res.status(404).json({ message: `No user with this ${req.params.u_id} id !`})
    };

    // const UserTamaData = dbUserTamaData.get({ plain: true })

    res.status(200).json(dbUserTamaData)

  } catch (err) {
    console.log('errorrrrrrrrrrrrrr')
    console.log(err);
    res.status(500).json(err);
  }
})

router.get('/me', authMiddleware, async (req, res) => {
  try {
    const dbUserTamaData = await User.findByPk(req.body.id,
    {
      include:
      [
        // {all: true, nested: true}
        { as: "tamas_owned",
        model: Tama,
        through: {
          attributes: {exclude: ['user_id', 'tama_id']} // | Will only include tama attributes (age, hunger, etc.) |
        }},
      ]
    })
    console.log(req.body)
    if (!dbUserTamaData) {
      res.status(404).json({ message: `No user with this ${req.body.id} id !`})
    };

    const UserTamaData = dbUserTamaData.get({ plain: true })

    res.status(200).json(UserTamaData)

  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
})

router.get('/uniquetama/:ut_id', authMiddleware, async (req, res) => {
  try{
    const dbUserTamaData = await UserTama.findByPk(req.params.ut_id);

    if (!dbUserTamaData) {
      res.status(404).json({ message: `No user or tama with user id of ${req.params.u_id} or tama id of ${req.params.t_id}!`})
    };

    res.status(200).json(dbUserTamaData);

  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
})

//ONE USER ONE TAMA
router.get('/:u_id/:t_id', authMiddleware, async (req, res) => {
  try {
    const dbUserTamaData = await User.findByPk(req.params.u_id,
    {
      include:
      [
        // {all: true, nested: true},
        { as: "tamas_owned",
        model: Tama,
        where: {id: req.params.t_id},
        through: {
          attributes: {exclude: ['user_id', 'tama_id']} // | Will only include tama attributes (age, hunger, etc.) |
        }},
      ]
    })

    if (!dbUserTamaData) {
      res.status(404).json({ message: `No user or tama with user id of ${req.params.u_id} or tama id of ${req.params.t_id}!`})
    };

    const UserTamaData = dbUserTamaData.get({ plain: true })
    // console.log('usertamadata', UserTamaData)
    const currentTama = UserTamaData.tamas_owned[0]
    // console.log('after selecting', currentTama)
    res.status(200).json(currentTama)

  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
})



//ONE USER ONE TAMA CHANGE STATS
router.put('/unique/:ut_id', async (req, res) => {
  try{
    const dbUserTamaData = await UserTama.update(
      req.body, {
        where: {
          id: req.params.ut_id // |Make changes to unique row in UserTama |
        }
      }
    );

    if (!dbUserTamaData) {
      res.status(404).json({ message: `No user or tama with user id of ${req.params.u_id} or tama id of ${req.params.t_id}!`})
    };

    res.status(200).json({dbUserTamaData, message: "Tama stats changed!"});

  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
})

//ONE USER ONE TAMA CHANGE STATS (WITH USER TOKEN)
router.put('/uniquetama/:ut_id', authMiddleware, async (req, res) => {
  try{
    const dbUserTamaData = await UserTama.update(
      req.body, {
        where: {
          id: req.params.ut_id // |Make changes to unique row in UserTama |
        }
      }
    );

    console.log(req.body)

    if (!dbUserTamaData) {
      res.status(404).json({ message: `No user or tama with user id of ${req.params.u_id} or tama id of ${req.params.t_id}!`})
    };

    res.status(200).json({dbUserTamaData, message: "Tama stats changed!"});

  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
})

//ONE USER NEW TAMA
router.post('/:u_id/:t_id', authMiddleware, async (req, res) => {
  try {
    const newUserTama = await UserTama.create({
      user_id: req.params.u_id,
      tama_id: req.params.t_id,
      age: 0,
      hunger: 100,
      happiness: 100,
      bladder: 100,
      status: 10,
      is_alive: true,
      is_awake: true,
    });

    const usertama = newUserTama.get({ plain: true })
    console.log('POST usertama data', usertama);
    res.status(200).json(usertama);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
})

module.exports = router